import React, { useState } from 'react';
import axios from 'axios';

function RegistrationSuccess({ userEmail }) {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');


    const resendActivationEmail = () => {
        axios.post('http://127.0.0.1:8000/api/auth/users/resend_activation/', { email: userEmail })
            .then(response => {
                if (response.status === 200) {
                    setSuccess('Activation email has been resent. Please check your inbox.');
                } else {
                    setError('Failed to resend activation email. Please try again later.');
                }
            })
            .catch(error => {
                setError('Failed to resend activation email. Please try again later.');
            });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <h1 style={{ color: '#333' }} >Registration Successful</h1>
            <p style={{ margin: '10px auto', textAlign: 'center', marginBottom: '15px', color: '#777' }} >An activation email has been sent to {userEmail}. Please check your inbox to activate your account.</p>
            <button onClick={resendActivationEmail} style={{ padding: '15px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} >Resend Email</button>
            {success && <div className='success-message' >{success}</div>}
            {error && <div className='error-message'>{error}</div>}
        </div>
    );
}

export default RegistrationSuccess;
