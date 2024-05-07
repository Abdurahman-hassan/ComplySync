import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../App';
import { formatDate } from '../utils';


const CampaignDetails = () => {

    const [campaignDetails, setCampaignDetails] = useState(null);
    const { campaignId } = useParams();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchCampaignDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/campaigns/${campaignId}`, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
                console.log(response.data);
                setCampaignDetails(response.data);
            } catch (error) {
                console.error('Error fetching campaign details:', error);
            }
        };

        fetchCampaignDetails();
    }, [campaignId, authToken]);

    if (!campaignDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className='campaign-details'>
            <h2>{campaignDetails.name}</h2>
            <p>Start on: {formatDate(campaignDetails.start_date)}</p>
            <p>End on: {formatDate(campaignDetails.end_date)}</p>
            <div className='policies'>
            <h4>Policies</h4>
                {campaignDetails.policies.map(policy => (
                    <div key={policy.id}>
                        <p>{policy.base_title}</p>
                    </div>
                ))}
            </div>
            <div className='groups'>
            <h4>Groups</h4>
                {campaignDetails.target_groups.map(group => (
                    <div key={group.id} >
                        <p>{group.group_name}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default CampaignDetails;
