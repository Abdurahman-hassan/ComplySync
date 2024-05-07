import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import '../styles/CreateCampaign.css';

const CreateCampaign = () => {

    const [campaignName, setCampaignName] = useState('');
    const [policies, setPolicies] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedPolicies, setSelectedPolicies] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const navigate = useNavigate();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchPolicies = async (url, allPolicies = []) => {
            try {
                const response = await axios.get(url, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
                const newData = response.data.results;
                const updatedPolicies = allPolicies.concat(newData);

                if (response.data.next) {
                    await fetchPolicies(response.data.next, updatedPolicies);
                } else {
                    setPolicies(updatedPolicies);
                }
            } catch (error) {
                console.error('Error fetching policies:', error);
            }
        };
        fetchPolicies('http://127.0.0.1:8000/api/policies/');
    }, [authToken]);

    useEffect(() => {
        const fetchGroups = async (url, allGroups = []) => {
            try {
                const response = await axios.get(url, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
                const newData = response.data.results;
                const updatedGroups = allGroups.concat(newData);

                if (response.data.next) {
                    await fetchGroups(response.data.next, updatedGroups);
                } else {
                    setGroups(updatedGroups);
                }
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
        fetchGroups('http://127.0.0.1:8000/api/groups/');
    }, [authToken]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(`campaign_name: ${campaignName}\nstart_date: ${startDateTime}\nend_date: ${endDateTime}`);
            const campaignResponse = await axios.post('http://127.0.0.1:8000/api/campaigns/', {
                name: campaignName,
                start_date: startDateTime,
                end_date: endDateTime,
            }, {
                headers: { 'Authorization': `Token ${authToken}` }
            });

            // Assign users to the campaign using the new campaign ID
            if (campaignResponse.data && campaignResponse.data.id) {
                const campaignId = campaignResponse.data.id;
                console.log(`policies_ids: ${selectedPolicies}`);
                console.log(`target_groups_ids: ${selectedGroups}`);
                console.log(`completed_users_groups_ids: ${selectedGroups}`);
                await axios.post(`http://127.0.0.1:8000/api/campaigns/${campaignId}/assign-resources/`, {
                    policies_ids: selectedPolicies, // An array of policies IDs to be added to the campaign
                    target_groups_ids: selectedGroups,
                    completed_users_groups_ids: selectedGroups
                }, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
            }

            navigate('/campaigns');
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    const handlePoliciySelection = (policyId) => {
        // Add or remove policy from selectedUsers array
        setSelectedPolicies(prevSelectedPolicies => {
            if (prevSelectedPolicies.includes(policyId)) {
                return prevSelectedPolicies.filter(id => id !== policyId);
            } else {
                return [...prevSelectedPolicies, policyId];
            }
        });
    };

    const handleGroupSelection = (groupId) => {
        // Add or remove group from selectedUsers array
        setSelectedGroups(prevSelectedGroups => {
            if (prevSelectedGroups.includes(groupId)) {
                return prevSelectedGroups.filter(id => id !== groupId);
            } else {
                return [...prevSelectedGroups, groupId];
            }
        });
    };


    return (
        <form className='create-campaign-form' onSubmit={handleSubmit}>
            <h2>Create Campaign</h2>
            <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Campaign Name"
                required
            />
            <label className='datetime-label'>Start Date</label>
            <input 
                    type="datetime-local" 
                    value={startDateTime} 
                    onChange={(e) => setStartDateTime(e.target.value)} 
                    required 
            />
            <label className='datetime-label'>End Date</label>
            <input 
                    type="datetime-local" 
                    value={endDateTime} 
                    onChange={(e) => setEndDateTime(e.target.value)} 
                    required 
            />
            <div className="policyOrgroup-selection-container">
                <h3>Select Policy</h3>
                <div className="policyOrgroup-selection">
                    {policies.map(policy => (
                        <div className="policyOrgroup-checkbox" key={policy.id}>
                            <input
                                id={`policy-checkbox-${policy.id}`}
                                type="checkbox"
                                value={policy.id}
                                checked={selectedPolicies.includes(policy.id)}
                                onChange={() => handlePoliciySelection(policy.id)}
                            />
                            <label htmlFor={`policy-checkbox-${policy.id}`}>
                                {policy.base_title}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="policyOrgroup-selection-container">
                <h3>Select Group</h3>
                <div className="policyOrgroup-selection">
                    {groups.map(group => (
                        <div className="policyOrgroup-checkbox" key={group.id}>
                            <input
                                id={`group-checkbox-${group.id}`}
                                type="checkbox"
                                value={group.id}
                                checked={selectedGroups.includes(group.id)}
                                onChange={() => handleGroupSelection(group.id)}
                            />
                            <label htmlFor={`group-checkbox-${group.id}`}>
                                {group.group_name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit" className="create-campaign-submit">Create</button>
        </form>
    );
}

export default CreateCampaign;