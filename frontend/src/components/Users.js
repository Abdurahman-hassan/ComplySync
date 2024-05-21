import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import '../styles/Users.css';
import LoadingSpinner from './LoadingSpinner';
import config from '../config';

const Users = () => {
    const { authToken } = useAuth(); 
    const [users, setUsers] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 400;
    const navigate = useNavigate();

    const fetchUsers = useCallback(async (url) => {
        const startTime = performance.now();
        setIsLoading(true);
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Token ${authToken}`
                }
            });
            console.log(response.data);
            setUsers(response.data.results);
            setNextPage(response.data.next); // Save the next page URL
            setPrevPage(response.data.previous); // Save the previous page URL
        } catch (error) {
            console.error('Error fetching users:', error);
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
        fetchUsers(`${config.apiBaseUrl}/auth/users/`);
    }, [fetchUsers]);

    const handleAddUser = () => {
        navigate('/users/add'); // Navigate to "user/add" route
    };

    const handleNextPage = () => {
        if (nextPage) {
            fetchUsers(nextPage);
        }
    };

    const handlePrevPage = () => {
        if (prevPage) {
            fetchUsers(prevPage);
        }
    };

    return (
        <>
            {isLoading ? (
                <LoadingSpinner /> 
            ) : (
                <div className='users-list'>
                    <div className="users-header">
                        <h2>Users</h2>
                        <button onClick={handleAddUser} className='add-user-button'>
                            Add Users
                        </button>
                    </div>
                    {users.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Is Active</th>
                                    <th>Is Staff</th>
                                    <th>Is Superuser</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.is_active ? 'Yes' : 'No'}</td>
                                        <td>{user.is_staff ? 'Yes' : 'No'}</td>
                                        <td>{user.is_superuser ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-users-message">
                            <h3>There are no users yet.</h3>
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

export default Users;
