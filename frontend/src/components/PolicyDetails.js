import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PolicyDetails.css';
import useFetchDetails from '../useFetch';
import { useAuth } from '../App';
import { useDelete } from '../utils';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import config from '../config';

const PolicyDetails = () => {

    const navigate = useNavigate();
    const { isAdmin, authToken } = useAuth();
    const { id } = useParams();
    const { data: policy, error } = useFetchDetails(`${config.apiBaseUrl}/policies/`, id);
    const { response: deleteResponse, error: deleteError, deleteChild } = useDelete(`${config.apiBaseUrl}/policies/`, id);
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 400;

    // State for handling document selection (dropdown for regular users)
    const [selectedDocumentId, setSelectedDocumentId] = useState(undefined);

    const [activeTabIndex, setActiveTabIndex] = useState(0); // Track the active tab index
    const [pdfUrls, setPdfUrls] = useState([]);

    const fetchpdfFile = useCallback(async (documentId) => {
        const startTime = performance.now();
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.apiBaseUrl}/languages/${documentId}/view-pdf/`, {
                headers: { Authorization: `Token ${authToken}` }
            });

            return response.data.presigned_url;
        } catch (error) {
            console.error('Error fetching document details:', error);
        } finally {
            const elapsedTime = performance.now() - startTime;
            if (elapsedTime < minimumLoadingTime) {
                const remainingTime = minimumLoadingTime - elapsedTime;
                setTimeout(() => setIsLoading(false), remainingTime);
            } else {
                setIsLoading(false);
            }
        }
    }, [authToken, minimumLoadingTime]);

    useEffect(() => {
        const fetchData = async () => {
            const promises = policy.languages.map(async (language) => {
                const url = await fetchpdfFile(language.id);
                return url;
            });

            const urls = await Promise.all(promises);
            setPdfUrls(urls);
        };

        if (policy) {
            fetchData();
        }
    }, [policy, fetchpdfFile]);

    // Function to handle tab click
    const handleTabClick = (index) => {
        setActiveTabIndex(index);
    };

    const handleDocumentChange = (event) => {
        const value = event.target.value;
        if (value !== "") {
            setSelectedDocumentId(parseInt(value));
        } else {
            setSelectedDocumentId(undefined);
        }
    };

    const handleMarkComplete = async () => {
        setIsLoading(true);
        try {
            const response = await axios.patch(`${config.apiBaseUrl}/policies/${id}/`, {
                status: "published"
            }, {
                headers: { Authorization: `Token ${authToken}` }
            });
            console.log("Policy marked complete:", response.data);
            // Refresh the page after successful update
            window.location.reload();
        } catch (error) {
            console.error("Error marking policy complete:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const extractFileName = (url) => {
        if (!url) return "";
        const parts = url.split("/");
        const filenameWithParams = parts[parts.length - 1];
        const filename = filenameWithParams.split("?")[0]; // Remove any query parameters
        return filename;
    };

    if (deleteResponse) {
        console.log(deleteResponse);
    }
    if (deleteError) {
        console.log(deleteError);
    }
    if (!policy) {
        return <div><LoadingSpinner /></div>;
    }

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className='policy-details'>
                        {error && <p>{error}</p>}
                        <div className="head">
                            <h2>{policy.base_title}</h2>
                            <div className="update-and-delete">
                                <button className="complete-btn" disabled={!policy || policy.status === "published"} onClick={handleMarkComplete}>
                                    Complete Reading
                                </button>
                                {isAdmin && <button className='update-btn' onClick={() => navigate(`/policies/${id}/update`)} >Update</button>}
                                {isAdmin && <button className='delete-btn' onClick={deleteChild}>Delete</button>}
                            </div>
                        </div>
                        {/*<p>Status: {policy.status}</p>*/}
                        <p>Minimum Read Time: {policy.min_read_time} minutes</p>
                        {/*<p>Allow Download: {policy.allow_download ? 'Yes' : 'No'}</p>*/}
                        <p>Description: {policy.description}</p>
                    </div>
                    <div className="documents">
                        <h2>Documents</h2>
                        {isAdmin ? ( // Display tabs for admins
                            <div className="tabs">
                                {policy.languages.map((language, index) => (
                                    <button key={language.id} className={`tab ${activeTabIndex === index ? 'active' : ''}`} onClick={() => handleTabClick(index)}>{language.language}</button>
                                ))}
                            </div>
                        ) : ( // Display dropdown for regular users
                            <select value={selectedDocumentId} onChange={handleDocumentChange}>
                                <option value="">Select Language</option>
                                {policy.languages.map((language) => (
                                    <option key={language.id} value={language.id}>{language.language}</option>
                                ))}
                            </select>
                        )}
                        <div className={`document-content ${selectedDocumentId || isAdmin ? '' : 'hidden'}`}>
                            <>
                                {isAdmin ? (
                                    activeTabIndex !== undefined && pdfUrls.length > activeTabIndex && pdfUrls[activeTabIndex] && (
                                        <>
                                            <h2>{policy.languages[activeTabIndex].localized_title}</h2>
                                            <iframe src={pdfUrls[activeTabIndex]} title="Document"></iframe>
                                        </>
                                    )
                                ) : (
                                    selectedDocumentId && pdfUrls.length > 0 && (
                                        <>
                                            <h2>{policy.languages.find(lang => lang.id === selectedDocumentId)?.localized_title}</h2>
                                            <iframe src={(() => {
                                                const selectedLanguage = policy.languages.find(lang => lang.id === selectedDocumentId);
                                                if (!selectedLanguage) return '';
                                                const selectedDocumentFile = selectedLanguage.document_file;
                                                const matchingUrl = pdfUrls.find(url => extractFileName(url) === extractFileName(selectedDocumentFile));
                                                console.log(matchingUrl);
                                                return matchingUrl || '';
                                            })()} title="Document"></iframe>
                                        </>
                                    )
                                )}
                            </>
                        </div>

                    </div>
                </>
            )}
        </>
    );
}

export default PolicyDetails;
