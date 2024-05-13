import React, { useState, useEffect, useCallback } from'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { formatDate } from '../utils';
import '../styles/Groups.css';
import LoadingSpinner from './LoadingSpinner';

const Groups = () => {

    const [groups, setGroups] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const navigate = useNavigate();
    const { authToken, isAdmin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    const fetchGroups = useCallback(async (url) => {
        const startTime = performance.now();
        setIsLoading(true);
        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Token ${authToken}` }
            });
            console.log(response.data);

            // Sort groups in reverse chronological order (newest first)
            // const sortedGroups = response.data.results.sort((a, b) => {
            //     return new Date(b.created_on) - new Date(a.created_on);
            // });

            setGroups(response.data.results);
            setNextPage(response.data.next); // Save the next page URL
            setPrevPage(response.data.previous); // Save the previous page URL
        } catch (error) {
            console.error('Error fetching groups:', error);
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
        fetchGroups('http://127.0.0.1:8000/api/groups/');
    }, [fetchGroups]);

    const handleGroupClick = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

    const handleCreateGroup = () => {
        navigate('/create-group');
    };

    const handleNextPage = () => {
        if (nextPage) {
            fetchGroups(nextPage);
        }
    };

    const handlePrevPage = () => {
        if (prevPage) {
            fetchGroups(prevPage);
        }
    };

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='groups-list'>
                <div className="groups-header">
                    <h2>Groups</h2>
                    {isAdmin && (
                    <button className='create-group-button' onClick={handleCreateGroup}>Create Group</button>
                )}
                </div>
                {groups.length > 0 ? (
                    groups.map(group => (
                        <div key={group.id} className='group-item' onClick={() => handleGroupClick(group.id)}>
                            <h3>{group.group_name}</h3>
                            <p>Created on: {formatDate(group.created_on)}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-policies-message">
                        <h3>You have not been added to any groups yet.</h3>
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

export default Groups;