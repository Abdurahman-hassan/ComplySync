import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../App';
import { formatDate } from '../utils';


const GroupDetails = () => {

    const [groupDetails, setGroupDetails] = useState(null);
    const { groupId } = useParams();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/groups/${groupId}`, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
                console.log(response.data);
                setGroupDetails(response.data);
            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        fetchGroupDetails();
    }, [groupId, authToken]);

    if (!groupDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className='group-details'>
            <h2>{groupDetails.group_name}</h2>
            <p>Created on: {formatDate(groupDetails.created_on)}</p>
        </div>
    );
}

export default GroupDetails;
