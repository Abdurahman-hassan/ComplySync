import React, { useState, useEffect, useCallback } from'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { formatDate } from '../utils';
import '../styles/Campaigns.css';
import LoadingSpinner from './LoadingSpinner';

const Campaigns = () => {

    const [campaigns, setCampaigns] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const navigate = useNavigate();
    const { authToken, isAdmin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    const fetchCampaigns = useCallback(async (url) => {
        const startTime = performance.now();
        setIsLoading(true);
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
        fetchCampaigns('https://api.greencoder.tech/api/campaigns/');
    }, [fetchCampaigns]);

    const handleCampaignClick = (campaignId) => {
        navigate(`/campaigns/${campaignId}`);
    };

    const handleCreateCampaign = () => {
        navigate('/campaigns/create');
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
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='campaigns-list'>
                <div className="campaigns-header">
                    <h2>Campaigns</h2>
                    {isAdmin && (
                    <button className='create-campaign-button' onClick={handleCreateCampaign}>Create Campaign</button>
                )}
                </div>
                {campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                        <div key={campaign.id} className='campaign-item' onClick={() => handleCampaignClick(campaign.id)}>
                            <h3>{campaign.name}</h3>
                            <p>Start on: {formatDate(campaign.start_date)}</p>
                            <p>End on: {formatDate(campaign.end_date)}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-policies-message">
                        <h3>There are no campaigns currently; keep tuned for the next one.</h3>
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
}

export default Campaigns;