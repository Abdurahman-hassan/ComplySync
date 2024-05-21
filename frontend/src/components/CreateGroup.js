import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import '../styles/CreateGroup.css';
import config from '../config';

const CreateGroup = () => {

    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();
    const { authToken } = useAuth();

    useEffect(() => {
        // Fetch the list of users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/auth/users/`, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
                console.log(response.data.results);
                setUsers(response.data.results);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [authToken]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const groupResponse = await axios.post(`${config.apiBaseUrl}/groups/`, {
                group_name: groupName
            }, {
                headers: { 'Authorization': `Token ${authToken}` }
            });

            // Assign users to the group using the new group ID
            if (groupResponse.data && groupResponse.data.id) {
                const groupId = groupResponse.data.id;
                await axios.post(`${config.apiBaseUrl}/groups/${groupId}/assign_users_to_group/`, {
                    user_ids: selectedUsers // An array of user IDs to be added to the group
                }, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
            }

            navigate('/groups');
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleUserSelection = (userId) => {
        // Add or remove user from selectedUsers array
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    return (
        <form className='create-group-form' onSubmit={handleSubmit}>
            <h2>Create Group</h2>
            <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
                required
            />
            <div className="user-selection-container">
                <h3>Select Users</h3>
                <div className="user-selection">
                    {users.map(user => (
                        <div className="user-checkbox" key={user.id}>
                            <input
                                id={`user-checkbox-${user.id}`}
                                type="checkbox"
                                value={user.id}
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleUserSelection(user.id)}
                            />
                            <label htmlFor={`user-checkbox-${user.id}`}>
                                {user.email}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit" className="create-group-submit">Create</button>
        </form>
    );
}

export default CreateGroup;