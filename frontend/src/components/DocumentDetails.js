import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DocumentDetails = () => {

    const [document, setDocument] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/languages/${id}`);
                setDocument(response.data);
            } catch (error) {
                console.error('Error fetching document details:', error);
            }
        };

        fetchDocumentDetails();
    }, [id]);

    if (!document) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{document.name}</h1>
            {/* Display document details here */}
        </div>
    );
}

export default DocumentDetails;