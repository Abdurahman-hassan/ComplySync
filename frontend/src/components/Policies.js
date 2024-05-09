// Policies.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Policies.css';
import { useAuth } from '../App';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    // const [newPolicyCreated, setNewPolicyCreated] = useState(false);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const { isAdmin } = useAuth(); // Access the isAdmin state from context
    // const headers = useMemo(() => ({
    //     'Authorization': `Token ${authToken}`
    // }), [authToken]);


    const fetchPolicies = useCallback(async (url) => {

            try {
                const response = await axios.get(url, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
                console.log(response.data);
    
                setPolicies(response.data.results);
                setNextPage(response.data.next); // Save the next page URL
                setPrevPage(response.data.previous); // Save the previous page URL
            } catch (error) {
                console.error('Error fetching policies:', error);
            }

    }, [authToken]);


    useEffect(() => {
        fetchPolicies('http://127.0.0.1:8000/api/policies/');
    }, [fetchPolicies]);

    const handleCreatePolicy = () => {
        navigate('/create-policy');
        // setNewPolicyCreated(true);
    };

    const handleNextPage = () => {
        if (nextPage) {
            fetchPolicies(nextPage);
        }
    };

    const handlePrevPage = () => {
        if (prevPage) {
            fetchPolicies(prevPage);
        }
    };

    return (
        <div className='policies-list'>
            <div className="policies-header">
                <h2>Policies Page</h2>
                { isAdmin && (
                <button onClick={handleCreatePolicy} className='create-policy-button'>
                    Create Policy
                </button>
            ) }
            </div>
            {policies.length > 0 ? (
                policies.map((policy, index) => (
                    <div key={index} onClick={() => navigate(`/policies/${policy.id}`)} className='policy-item'>
                        <h3>{policy.base_title}</h3>
                        <p>{policy.description}</p>
                    </div>
                ))
            ) : (
                <div className="no-policies-message">
                    <h3>There are no policies now, enjoy the silence.</h3>
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
    );
};

export default Policies;
