import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PolicyDetails.css';
import useFetch from '../useFetch';

const PolicyDetails = () => {

    const { id } = useParams();
    const { data: policy, error } = useFetch("http://127.0.0.1:8000/api/policies/", id);

    if (!policy) {
        return <div>Loading...</div>;
    }

    return (
        <div className='policy-details-container'>
            <h2>Policy Details</h2>
            {error && <p>{error}</p>}
            <h3>{policy.base_title}</h3>
            <p>Status: {policy.status}</p>
            <p>Minimum Read Time: {policy.min_read_time} minutes</p>
            <p>Allow Download: {policy.allow_download ? 'Yes' : 'No'}</p>
            <p>Description: {policy.description}</p>
        </div>
    );
}

export default PolicyDetails;
