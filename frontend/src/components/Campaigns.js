import React, { useState, useEffect, useCallback } from'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { formatDate } from '../utils';
import '../styles/Campaigns.css';

const Campaigns = () => {

    const [campaigns, setCampaigns] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const navigate = useNavigate();
    const { authToken, isAdmin } = useAuth();

    const fetchCampaigns = useCallback(async (url) => {
        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Token ${authToken}` }
            });
            console.log(response.data);

            setCampaigns(response.data.results);
            setNextPage(response.data.next); // Save the next page URL
            setPrevPage(response.data.previous); // Save the previous page URL
        } catch (error) {
            console.error('Error fetching Campaigns:', error);
        }
    }, [authToken]);

    useEffect(() => {
        fetchCampaigns('http://127.0.0.1:8000/api/campaigns/');
    }, [fetchCampaigns]);

    const handleCampaignClick = (campaignId) => {
        navigate(`/campaigns/${campaignId}`);
    };

    const handleCreateCampaign = () => {
        navigate('/create-campaign');
    };

    const handleNextPage = () => {
        if (nextPage) {
            fetchCampaigns(nextPage);
        }
    };

    const handlePrevPage = () => {
        if (prevPage) {
            fetchCampaigns(prevPage);
        }
    };

    return (
        <div className='campaigns-list'>
            <div className="campaigns-header">
                <h2>Campaigns</h2>
                {isAdmin && (
                <button className='create-campaign-button' onClick={handleCreateCampaign}>Create Campaign</button>
            )}
            </div>
            {campaigns.map(campaign => (
                <div key={campaign.id} className='campaign-item' onClick={() => handleCampaignClick(campaign.id)}>
                    <h3>{campaign.name}</h3>
                    <p>Start on: {formatDate(campaign.start_date)}</p>
                    <p>End on: {formatDate(campaign.end_date)}</p>
                </div>
            ))}
            <div className='pagination-buttons'>
                {prevPage && (
                    <button className='prev-page-button' onClick={handlePrevPage}>Previous Page</button>
                )}
                {nextPage && (
                    <button className='next-page-button' onClick={handleNextPage}>Next Page</button>
                )}
            </div>
        </div>
    );
}

export default Campaigns;