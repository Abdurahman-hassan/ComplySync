import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

function useQuery() {
    const location = useLocation();
    return new URLSearchParams(location.search);
}

const ResetPassword = () => {

    const query = useQuery();
    const uid = query.get('uid');
    const token = query.get('token');
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    const resetPassword = useCallback(async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        if (uid && token) {
            const startTime = performance.now();
            setIsLoading(true);
            try {
                const response = await axios.post(
                    'http://localhost:8000/api/auth/users/reset_password_confirm/',
                    { uid, token, new_password: newPassword, re_new_password: confirmPassword }
                );
                if (response.status === 200) {
                    setSuccess('Password updated successfully!');
                    // Display success message for 3 seconds before navigating
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setError('Failed to reset password.');
                }
                setSuccess('Password updated successfully!');
                navigate('/login');
            } catch (error) {
                setError('Failed to reset password.');
            } finally {
                const elapsedTime = performance.now() - startTime;
                if (elapsedTime < minimumLoadingTime) {
                    const remainingTime = minimumLoadingTime - elapsedTime;
                    setTimeout(() => setIsLoading(false), remainingTime);
                } else {
                    setIsLoading(false);
                }
            }
        }
    }, [uid, token, navigate, newPassword, confirmPassword]);


    return (
        <div className='signup-container'>
            <div className="signup-form">
                <h1>Reset Password</h1>
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit" onClick={resetPassword} disabled={isLoading}>{isLoading ? <ThreeDots visible={true} height="50" width="50" color="#fff" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" /> : 'Reset Password'}</button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </div>
        </div>

    );
}

export default ResetPassword;