// Policies.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Policies.css';
import { useAuth } from '../App';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    const [newPolicyCreated, setNewPolicyCreated] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState('http://127.0.0.1:8000/api/policies');
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const { isAdmin } = useAuth(); // Access the isAdmin state from context
    const headers = useMemo(() => ({
        'Authorization': `Token ${authToken}`
    }), [authToken]);

    useEffect(() => {

        const fetchPolicies = async () => {
            if (!nextPageUrl) return; // Stop if there's no next page

            try {
                const response = await axios.get(nextPageUrl, { headers });
                setPolicies(prevPolicies => [...prevPolicies, ...response.data.results]);
                setNextPageUrl(response.data.next);
            } catch (error) {
                console.error('Error fetching policies:', error);
            }
        };

        fetchPolicies();
    }, [authToken, nextPageUrl, newPolicyCreated, headers]);

    const handleCreatePolicy = () => {
        navigate('/create-policy');
        setNewPolicyCreated(true);
    };

    return (
        <div className='policies-container'>
            <div className="policies-header">
                <h2>Policies Page</h2>
                { isAdmin && (
                <button onClick={handleCreatePolicy} className='create-policy-btn'>
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
        </div>
    );
};

export default Policies;
