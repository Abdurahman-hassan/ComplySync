import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useFetchDetails from '../useFetch';
import { useAuth } from '../App';
import '../styles/Documents.css'
import LoadingSpinner from './LoadingSpinner';
import config from '../config';

const DocumentDetails = () => {

    const { id } = useParams();
    const { authToken } = useAuth();
    const { data: document, error } = useFetchDetails(`${config.apiBaseUrl}/languages/`, id);
    const [pdfFile, setPdfFile] = useState(null);
    const [policy, setPolicy] = useState('');

    useEffect(() => {
        const fetchpdfFile = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/languages/${id}/view-pdf/`, {
                    headers: { Authorization: `Token ${authToken}` }
                });
                setPdfFile(response.data.presigned_url);
            } catch (error) {
                console.error('Error fetching document details:', error);
            }
        };

        const fetchPolicy = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/policies/${document.policy}/`, {
                    headers: { Authorization: `Token ${authToken}` }
                });
                console.log(response.data);
                setPolicy(response.data);
            } catch (error) {
                console.error('Error fetching policy details:', error);
            }
        };
    
        fetchPolicy();

        fetchpdfFile();
    }, [id, authToken, document]);

    if (!document) {
        return <div><LoadingSpinner /></div>;
    }

    return (
        <div className='document-details'>
            {error && <p>{error}</p>}
            <div className="head">
                <h2>{document.localized_title}</h2>
                <p>{policy.base_title}</p>
            </div>
            <iframe src={pdfFile} title="Document"></iframe>
        </div>
    );
}

export default DocumentDetails;