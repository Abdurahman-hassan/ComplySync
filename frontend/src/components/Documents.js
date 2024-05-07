import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Documents = () => {

    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/languages/');
                setDocuments(response.data.results);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);


    const handleUploadDocument = () => {
        navigate('/upload-pdf');
    };

    const handleDocumentClick = (groupId) => {
        navigate(`/documents/${document.id}`);
    };

    return (
        <div>
            <h1>Documents</h1>

            {documents.map(document => (
                <div key={document.id} className='document-item' onClick={() => handleDocumentClick(document.id)}>
                    <h3>{document.name}</h3>
                </div>
            ))}
            {isAdmin && (
                <button onClick={handleUploadDocument} >Upload New Document</button>
            )}
        </div>
    );
}

export default Documents;