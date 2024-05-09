import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import useFetchDetails from '../useFetch';
import '../styles/CreatePolicy.css';

const UpdatePolicy = () => {

    const navigate = useNavigate();
    const { authToken } = useAuth();
    const { id } = useParams();
    const [base_title, setBaseTitle] = useState('');
    const [min_read_time, setMinReadTime] = useState(0);
    const [status, setStatus] = useState('');
    const [allow_download, setAllowDownload] = useState(false);
    const [description, setDescription] = useState('');
    const { data: policyDetails, error } = useFetchDetails("http://127.0.0.1:8000/api/policies/", id);
    const headers = {
        Authorization: `Token ${authToken}`,
    };

    useEffect(() => {
        if (policyDetails) {
            setBaseTitle(policyDetails.base_title);
            setMinReadTime(policyDetails.min_read_time);
            setStatus(policyDetails.status);
            setAllowDownload(policyDetails.allow_download);
            setDescription(policyDetails.description);
        }
    }, [policyDetails]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedData = {};

        if (base_title !== policyDetails.base_title) {
            updatedData.base_title = base_title;
        }
        if (min_read_time !== policyDetails.min_read_time) {
            updatedData.min_read_time = min_read_time;
        }
        if (status !== policyDetails.status) {
            updatedData.status = status;
        }
        if (allow_download !== policyDetails.allow_download) {
            updatedData.allow_download = allow_download;
        }
        if (description !== policyDetails.description) {
            updatedData.description = description;
        }

        if (Object.keys(updatedData).length > 0) {
            try {
                const response = await axios.patch(`http://127.0.0.1:8000/api/policies/${id}/`, updatedData, { headers });
                console.log('response:', response);
                navigate('/policies');
            } catch (error) {
                console.error('Error updating policy:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className='create-policy-form'>
            <h2>Update Policy</h2>
            {error && <p>{error}</p>}
            <label>
                Title:
                <input
                    type="text"
                    name="base_title"
                    value={base_title}
                    onChange={(e) => setBaseTitle(e.target.value)}
                />
            </label>
            <label>
                Minimum Read Time (minutes):
                <input
                    type="number"
                    name="min_read_time"
                    min="1"
                    value={min_read_time}
                    onChange={(e) => setMinReadTime(e.target.value)}
                />
            </label>
            <label>
                Allow Download:
                <input
                    type="checkbox"
                    name="allow_download"
                    checked={allow_download}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                />
            </label>
            <label>
                Description:
                <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <button className='create-policy-submit' type="submit">Update</button>
        </form>
    );

}

export default UpdatePolicy;