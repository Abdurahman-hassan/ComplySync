import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PolicyDetails.css';
import useFetch from '../useFetch';
import { useAuth } from '../App';
import { useDelete } from '../utils';

const PolicyDetails = () => {

    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { id } = useParams();
    const { data: policy, error } = useFetch("http://127.0.0.1:8000/api/policies/", id);
    const { response: deleteResponse, error: deleteError, deleteChild } = useDelete("http://127.0.0.1:8000/api/policies/", id);

    if (deleteResponse) {
        console.log(deleteResponse);
    }
    if (deleteError) {
        console.log(deleteError);
    }
    if (!policy) {
        return <div>Loading...</div>;
    }

    return (
        <div className='policy-details-container'>
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
    );
}

export default PolicyDetails;
