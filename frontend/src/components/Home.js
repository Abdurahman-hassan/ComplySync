import React from'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    }

    return (
        <div>
            <h1>Welcome to ComplySync!</h1>
            {/* Additional content */}
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Home;