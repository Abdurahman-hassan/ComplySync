import React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { formatDate } from '../utils';
import useFetchDetails from '../useFetch';
import { useDelete } from '../utils';
import { useAuth } from '../App';
import LoadingSpinner from './LoadingSpinner';
import config from '../config';

const CampaignDetails = () => {

    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { campaignId } = useParams();
    const { data: campaignDetails, error } = useFetchDetails(`${config.apiBaseUrl}/campaigns/`, campaignId);
    const { response: deleteResponse, error: deleteError, deleteChild } = useDelete(`${config.apiBaseUrl}/campaigns/`, campaignId);

    if (deleteResponse) {
        console.log(deleteResponse);
    }

    if (deleteError) {
        console.log(deleteError);
    }

    if (!campaignDetails) {
        return <div><LoadingSpinner /></div>;
    }

    return (
        <div className='campaign-details'>
            <div>{error && error}</div>
            <div className="head">
                <h2>{campaignDetails.name}</h2>
                <div className="update-and-delete">
                    {isAdmin && <button className='update-btn' onClick={() => navigate(`/campaigns/${campaignId}/update`)} >Update</button>}
                    {isAdmin && <button className='delete-btn' onClick={deleteChild}>Delete</button>}
                </div>
            </div>
            <p>Start on: {formatDate(campaignDetails.start_date)}</p>
            <p>End on: {formatDate(campaignDetails.end_date)}</p>
            <div className='policies'>
            <h4>Policies</h4>
                {campaignDetails.policies.map(policy => (
                    <div key={policy.id}>
                        <NavLink to={`/policies/${policy.id}`}><p>{policy.base_title}</p></NavLink>
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
