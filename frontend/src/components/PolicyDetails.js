import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/PolicyDetails.css';

const PolicyDetails = () => {

    const [policy, setPolicy] = useState(null);
    const { id } = useParams();
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        const headers = {
            Authorization: `Token ${authToken}`,
        };

        const fetchPolicyDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/policies/${id}`, { headers });
                setPolicy(response.data);
            } catch (error) {
                console.error('Error fetching policy details:', error);
            }
        };

        fetchPolicyDetails();
    }, [id, authToken]);

    if (!policy) {
        return <div>Loading...</div>;
    }

    return (
        <div className='policy-details-container'>
            <h2>Policy Details</h2>
            <h3>{policy.base_title}</h3>
            <p>Status: {policy.status}</p>
            <p>Minimum Read Time: {policy.min_read_time} minutes</p>
            <p>Allow Download: {policy.allow_download ? 'Yes' : 'No'}</p>
            <p>Description: {policy.description}</p>
        </div>
    );
}

export default PolicyDetails;
