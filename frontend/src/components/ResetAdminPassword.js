import { useState } from "react";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import config from "../config";

const ResetAdminPassword = () => {

    const { authToken } = useAuth();
    const navigate = useNavigate();
    // const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        // if (newPassword === currentPassword) {
        //     setError("New password must be different from current password");
        //     return;
        // }
        const startTime = performance.now();
        setIsLoading(true);
        try {
            const response = await axios.post(`${config.apiBaseUrl}/auth/users/set_password/`, {
                current_password: newPassword,
                new_password: newPassword,
                re_new_password: confirmPassword
            },
                {
                    headers: {
                        'Authorization': `Token ${authToken}`
                    }
                }

            );
            if (response.status === 204) {
                setSuccess('Password changed successfully!');
                // Display success message for 3 seconds before navigating
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError('Failed to reset password.');
            }
        } catch (error) {
            setError(`Failed to reset password: ${error}`);
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


    return (
        <div className='signup-container'>
            <div className="signup-form">
                <h1>Reset Password</h1>
                {/* <label htmlFor="currentPassword">Current Password</label>
                <input type="password" id="currentPassword" placeholder="Enter your current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /> */}
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit" onClick={handleSubmit} disabled={isLoading}>{isLoading ? <ThreeDots visible={true} height="50" width="50" color="#fff" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" /> : 'Reset Password'}</button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </div>
        </div>
    );
}

export default ResetAdminPassword;
