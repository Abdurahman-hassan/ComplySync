import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import ResetPassword from './ResetPassword';

function useQuery() {
    const location = useLocation();
    return new URLSearchParams(location.search);
}

function ActivationPage() {
    const query = useQuery();
    const uid = query.get('uid');
    const token = query.get('token');
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    useEffect(() => {
        const activateAccount = async () => {
            const startTime = performance.now();
            setIsLoading(true);

            try {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/users/activation/', {
                    uid,
                    token,
                });

                if (response.status === 204) {
                    setSuccess('Account activated successfully!');
                    // Redirect to reset password after a short delay for user feedback
                    const redirectUrl = `/auth/reset-password?uid=${uid}&token=${token}`; // Construct redirect URL with params
                    setTimeout(() => navigate(redirectUrl), 2000); // Navigate to ResetPassword with uid and token
                } else {
                    setError('Failed to activate account. The link may be invalid or expired.');
                }
            } catch (error) {
                console.error('Error activating account:', error);
                setError('An unexpected error occurred. Please try again later.');
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

        if (uid && token) {
            activateAccount();
        }
    }, [uid, token, navigate]);

    return (
        <div className='container' style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: '#333' }}>Activating your account...</h1>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {success && <div className="success-message">{success}</div>}
                    {error && <div className="error-message">{error}</div>}
                </>
            )}
        </div>
    );
}

export default ActivationPage;
