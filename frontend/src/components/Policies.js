// Policies.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Policies.css';
import { useAuth } from '../App';
import LoadingSpinner from './LoadingSpinner';
import config from '../config';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    // const [newPolicyCreated, setNewPolicyCreated] = useState(false);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const { isAdmin } = useAuth(); // Access the isAdmin state from context
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 400;
    // const headers = useMemo(() => ({
    //     'Authorization': `Token ${authToken}`
    // }), [authToken]);


    const fetchPolicies = useCallback(async (url) => {
        const startTime = performance.now();
        setIsLoading(true);
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
        } finally {
            const elapsedTime = performance.now() - startTime;
            if (elapsedTime < minimumLoadingTime) {
                const remainingTime = minimumLoadingTime - elapsedTime;
                setTimeout(() => setIsLoading(false), remainingTime);
            } else {
                setIsLoading(false);
            }
        }

    }, [authToken, minimumLoadingTime]);


    useEffect(() => {
        fetchPolicies(`${config.apiBaseUrl}/policies/`);
    }, [fetchPolicies]);

    const handleCreatePolicy = () => {
        navigate('/policies/create');
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
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='policies-list'>
                    <div className="policies-header">
                        <h2>Policies</h2>
                        {isAdmin && (
                            <button onClick={handleCreatePolicy} className='create-policy-button'>
                                Create Policy
                            </button>
                        )}
                    </div>
                    {policies.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Number of Languages</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.map((policy, index) => (
                                    <tr key={index} onClick={() => navigate(`/policies/${policy.id}`)}>
                                        <td>{policy.base_title}</td>
                                        <td>{policy.description}</td>
                                        <td>{policy.status}</td>
                                        <td>{policy.languages.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
            )}
        </>
    );
};

export default Policies;
