import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils';
import useFetchDetails from '../useFetch';
import { useAuth } from '../App';
import { useDelete } from '../utils';
import LoadingSpinner from './LoadingSpinner';

const GroupDetails = () => {

    const { groupId } = useParams();
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const { data: groupDetails, error } = useFetchDetails(`http://127.0.0.1:8000/api/groups/`, groupId);
    const { response: deleteResponse, error: deleteError, deleteChild } = useDelete("http://127.0.0.1:8000/api/groups/", groupId);

    if (deleteResponse) {
        console.log(deleteResponse);
    }

    if (deleteError) {
        console.log(deleteError);
    }

    if (!groupDetails) {
        return <div><LoadingSpinner /></div>;
    }

    return (
        <div className='group-details'>
            {error && <p>Error: {error}</p>}
            <div className="head">
                <h2>{groupDetails.group_name}</h2>
                <div className="update-and-delete">
                    {isAdmin && <button className='update-btn' onClick={() => navigate(`/groups/${groupId}/update`)}>Update</button>}
                    {isAdmin && <button className='delete-btn' onClick={deleteChild}>Delete</button>}
                </div>
            </div>
            <p>Created on: {formatDate(groupDetails.created_on)}</p>
        </div>
    );
}

export default GroupDetails;
