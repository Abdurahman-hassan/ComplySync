import React from'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {

    const navigate = useNavigate();

    const logout = async () => {
    const authToken = localStorage.getItem('authToken');
    const config = {
        headers: { Authorization: `Token ${authToken}` }
    };
    await axios.post('http://127.0.0.1:8000/api/auth/token/logout/', null, config);
    localStorage.removeItem('authToken');
    navigate('/');
    }

    return (
        <div>
            <h1>Welcome to ComplySync!</h1>
            <Link to="/emailuploader">Upload users</Link>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Home;