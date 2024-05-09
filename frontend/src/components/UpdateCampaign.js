import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import useFetchDetails from '../useFetch';
import '../styles/CreateCampaign.css';

const UpdateCampaign = () => {

    const navigate = useNavigate();
    const { authToken } = useAuth();
    const { campaignId } = useParams();
    const [campaignName, setCampaignName] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const { data: campaignDetails, error } = useFetchDetails("http://127.0.0.1:8000/api/campaigns/", campaignId);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        // Set the form fields to the current campaign details once they are fetched
        if (campaignDetails) {
            setCampaignName(campaignDetails.name);
            setStartDateTime(formatDateTime(campaignDetails.start_date));
            setEndDateTime(formatDateTime(campaignDetails.end_date));
        }
    }, [campaignDetails]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            const updatedFields = {};
            // Check if campaignName has changed
            if (campaignName !== campaignDetails.name) {
                updatedFields.name = campaignName;
            }
            if (startDateTime !== campaignDetails.start_date) {
                updatedFields.start_date = startDateTime;
            }
            if (endDateTime !== campaignDetails.end_date) {
                updatedFields.end_date = endDateTime;
            }

            // Send the PATCH request only if there are updated fields
            if (Object.keys(updatedFields).length > 0) {
                await axios.patch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/`, updatedFields, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
            }

            navigate('/campaigns');
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    if (!campaignDetails) {
        return <div>{error && error}</div>;
    }

    return (
        <form className='create-campaign-form' onSubmit={handleSubmit}>
            <h2>Update Campaign</h2>
            <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Campaign Name"

            />
            <label className='datetime-label'>Start Date</label>
            <input 
                    type="datetime-local" 
                    value={startDateTime} 
                    onChange={(e) => setStartDateTime(e.target.value)} 
            />
            <label className='datetime-label'>End Date</label>
            <input 
                    type="datetime-local" 
                    value={endDateTime} 
                    onChange={(e) => setEndDateTime(e.target.value)} 
            />
    
            <button type="submit" className="create-campaign-submit">Update</button>
        </form>
    );
}

export default UpdateCampaign;