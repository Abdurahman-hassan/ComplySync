import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from'react-router-dom';

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

    useEffect(() => {
        if (uid && token) {
            axios.post('http://localhost:8000/api/auth/users/activation/', { uid, token })
                .then(response => {
                    // alert('Account activated successfully!');
                    if (response.status === 200) {
                        setSuccess('Account activated successfully!');
                        setTimeout(() => navigate('/login'), 3000);
                    } else {
                        setError('Failed to activate account. The link may be invalid or expired.');
                    }
                })
                .catch(error => {
                    // alert('Failed to activate account. The link may be invalid or expired.');
                    setError('Failed to activate account. The link may be invalid or expired.');
                });
        }
    }, [uid, token, navigate]);

    return (
        <div className='container' style={{  textAlign: 'center', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: '#333' }} >Activating your account...</h1>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default ActivationPage;