import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PolicyDetails.css';
import useFetch from '../useFetch';
import { useAuth } from '../App';
import { useDelete } from '../utils';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';

const PolicyDetails = () => {

    const navigate = useNavigate();
    const { isAdmin, authToken } = useAuth();
    const { id } = useParams();
    const { data: policy, error } = useFetch("http://127.0.0.1:8000/api/policies/", id);
    const { response: deleteResponse, error: deleteError, deleteChild } = useDelete("http://127.0.0.1:8000/api/policies/", id);
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 400;

    const [pdfUrls, setPdfUrls] = useState([]);

    const fetchpdfFile = useCallback(async (documentId) => {
        const startTime = performance.now();
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/languages/${documentId}/view-pdf/`, {
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
                                {isAdmin && <button className='update-btn' onClick={() => navigate(`/policies/${id}/update`)} >Update</button>}
                                {isAdmin && <button className='delete-btn' onClick={deleteChild}>Delete</button>}
                            </div>
                        </div>
                        <p>Status: {policy.status}</p>
                        <p>Minimum Read Time: {policy.min_read_time} minutes</p>
                        <p>Allow Download: {policy.allow_download ? 'Yes' : 'No'}</p>
                        <p>Description: {policy.description}</p>
                    </div>
                    <div className="documents">
                        <h2>Documents</h2>
                        <div className="document-list">
                            {policy.languages.map((language, index) => (
                                <div key={language.id} className='document-details'>
                                    <div className="head">
                                        <h2>{language.localized_title}</h2>
                                        <p>{language.language}</p>
                                    </div>
                                    {pdfUrls.length > index && pdfUrls[index] && (
                                        <iframe src={pdfUrls[index]} title="Document"></iframe>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default PolicyDetails;
