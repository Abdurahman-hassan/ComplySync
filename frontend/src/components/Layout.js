import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import axios from "axios";

// Layout component that includes the sidebar and navbar
const Layout = ({ children, username }) => {

    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    // Memoize the headers object
    const headers = useMemo(() => ({
        'Authorization': `Token ${authToken}`
    }), [authToken]);

    // Function to determine the active link class
    const getActiveLinkClass = ({ isActive }) => isActive ? 'active' : '';

    const logout = async () => {
        await axios.post('http://127.0.0.1:8000/api/auth/token/logout/', null, { headers });
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="app">
            <div className="sidebar">
                <h1>ComplySync</h1>
                <NavLink to="/home" className={getActiveLinkClass}><button>Home</button></NavLink>
                <NavLink to="/policies" className={getActiveLinkClass}><button>Policies</button></NavLink>
                <NavLink to="/create-campaign" className={getActiveLinkClass}><button>Create Campaign</button></NavLink>
                <NavLink to="/emailuploader" className={getActiveLinkClass}><button>Email Uploader</button></NavLink>
                <button onClick={logout}>Logout</button>
            </div>
            <div className="main-content">
                <div className="navbar">
                    <span>Welcome, {username}</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Layout;
