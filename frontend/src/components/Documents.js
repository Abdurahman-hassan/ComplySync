import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import  '../styles/Documents.css';
import { formatDate } from '../utils';
import LoadingSpinner from './LoadingSpinner';

const Documents = () => {

    const navigate = useNavigate();
    const { authToken, isAdmin } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    const fetchDocuments = useCallback(async (url) => {
        const startTime = performance.now();
        setIsLoading(true);
        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Token ${authToken}` }
            });
            console.log(response.data);

            setDocuments(response.data.results);
            setNextPage(response.data.next); // Save the next page URL
            setPrevPage(response.data.previous); // Save the previous page URL
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            const elapsedTime = performance.now() - startTime;
            if (elapsedTime < minimumLoadingTime) {
                const remainingTime = minimumLoadingTime - elapsedTime;
                setTimeout(() => setIsLoading(false), remainingTime);
            } else {
                setIsLoading(false);
            }
        }

    }, [authToken]);


    useEffect(() => {
        fetchDocuments('http://127.0.0.1:8000/api/languages/');
    }, [fetchDocuments]);

    const handleNextPage = () => {
        if (nextPage) {
            fetchDocuments(nextPage);
        }
    };

    const handlePrevPage = () => {
        if (prevPage) {
            fetchDocuments(prevPage);
        }
    };

    const handleUploadDocument = async () => {
        const url = 'http://127.0.0.1:8000/api/upload-pdf/';
        window.open(url, '_blank');
    };

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
            <div className='documents-list'>
                <div className="documents-header">
                    <h2>Documents</h2>
                    { isAdmin && (
                    <button onClick={handleUploadDocument} className='create-policy-button'>
                        Uplaod Document
                    </button>
                ) }
                </div>
                {documents.length > 0 ? (
                    documents.map((document, index) => (
                        <div key={index} onClick={() => navigate(`/documents/${document.id}`)} className='document-item'>
                            <h3>{document.localized_title}</h3>
                            <p>{formatDate(document.last_updated)}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-documents-message">
                        <h3>There are no documents now, enjoy the silence.</h3>
                    </div>
                )}
                <div className='pagination-buttons'>
                    {prevPage && (
                        <button className='prev-page-button' onClick={handlePrevPage}>Previous Page</button>
                    )}
                    {nextPage && (
                        <button className='next-page-button' onClick={handleNextPage}>Next Page</button>
                    )}
                </div>
            </div>
            )}
        </>
    );
};

export default Documents;