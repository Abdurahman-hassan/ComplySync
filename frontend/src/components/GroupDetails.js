import React from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from '../utils';
import useFetch from '../useFetch';

const GroupDetails = () => {

    const { groupId } = useParams();
    const { data: groupDetails, error } = useFetch(`http://127.0.0.1:8000/api/groups/`, groupId);

    if (!groupDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className='group-details'>
            {error && <p>Error: {error}</p>}
            <h2>{groupDetails.group_name}</h2>
            <p>Created on: {formatDate(groupDetails.created_on)}</p>
        </div>
    );
}

export default GroupDetails;
