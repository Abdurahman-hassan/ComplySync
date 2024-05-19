import React, { useState } from 'react';
import axios from 'axios';

function RegistrationSuccess({ userEmail }) {
    const [message, setMessage] = useState('');

    const resendActivationEmail = () => {
        axios.post('https://api.greencoder.tech/api/auth/users/resend_activation/', { email: userEmail })
            .then(response => {
                if (response.status === 200) {
                    setMessage('Activation email has been resent. Please check your inbox.');
                } else {
                    setMessage('Failed to resend activation email. Please try again later.');
                }
            })
            .catch(error => {
                setMessage('Failed to resend activation email. Please try again later.');
            });
    };

    return (
        <div>
            <h1>Registration Successful</h1>
            <p>An activation email has been sent to {userEmail}. Please check your inbox to activate your account.</p>
            <button onClick={resendActivationEmail}>Resend Email</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default RegistrationSuccess;
