import React, { useEffect } from 'react';
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

    useEffect(() => {
        if (uid && token) {
            axios.post('https://api.greencoder.tech/api/auth/users/activation/', { uid, token })
                .then(response => {
                    alert('Account activated successfully!');
                    navigate('/login');
                })
                .catch(error => {
                    alert('Failed to activate account. The link may be invalid or expired.');
                });
        }
    }, [uid, token, navigate]);

    return (
        <div>
            <h1>Activating your account...</h1>
        </div>
    );
}

export default ActivationPage;