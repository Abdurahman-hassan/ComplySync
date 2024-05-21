import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import '../styles/Profile.css';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Profile = () => {
    const [user, setUser] = useState(null);
    const { isAdmin, authToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const minimumLoadingTime = 400;

    useEffect(() => {
        const fetchUserProfile = async () => {
            const startTime = performance.now();
            setIsLoading(true);
            try {
                const response = await axios.get(`${config.apiBaseUrl}/auth/users/me`, {
                    headers: { Authorization: `Token ${authToken}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                const elapsedTime = performance.now() - startTime;
                if (elapsedTime < minimumLoadingTime) {
                    const remainingTime = minimumLoadingTime - elapsedTime;
                    setTimeout(() => setIsLoading(false), remainingTime);
                } else {
                    setIsLoading(false);
                }
            }
        };

        fetchUserProfile();
    }, [authToken, minimumLoadingTime]);

    const handleResetPassword = async () => {
        if (!user?.email) {
            console.error('User email not available');
            return;
        }

        if (isAdmin) {
            navigate('/profile/reset-password');
            return;
        }

        const userEmail = user.email;

        try {
            const response = await axios.post(`${config.apiBaseUrl}/auth/users/reset_password/`, {
                email: userEmail,
            });
            console.log('Reset password request sent:', response.data);
            setSuccessMessage("Password reset email sent");
        } catch (error) {
            console.error('Error sending reset password request:', error);
            setErrorMessage("Error sending reset password request");
        }
    };

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : user ? (
                <div className="profile-container">
                    <h2>Profile</h2>
                    <p>Name: {user.name || 'N/A'}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={handleResetPassword} className="reset-password-button">
                        Reset Password
                    </button>
                    {successMessage && <div className='success-message'>{successMessage}</div>}
                    {errorMessage && <div className='error-message'>{errorMessage}</div>}
                </div>
            ) : (
                <p className='error-message'>Error fetching user profile.</p>
            )}
        </>
    );
};

export default Profile;
