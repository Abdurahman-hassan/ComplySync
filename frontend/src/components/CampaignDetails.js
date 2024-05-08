import React from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from '../utils';
import useFetch from '../useFetch';

const CampaignDetails = () => {

    const { campaignId } = useParams();
    const { data: campaignDetails, error } = useFetch("http://127.0.0.1:8000/api/campaigns/", campaignId);

    if (!campaignDetails) {
        return <div>{error && error}</div>;
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
