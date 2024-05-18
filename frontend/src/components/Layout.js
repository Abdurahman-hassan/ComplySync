import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import axios from "axios";


// Layout component that includes the sidebar and navbar
const Layout = ({ children, username, handleLogout }) => {

    const navigate = useNavigate();
    const { authToken, isAdmin } = useAuth();
    // Memoize the headers object
    const headers = useMemo(() => ({
        'Authorization': `Token ${authToken}`
    }), [authToken]);
    const [showBackButton, setShowBackButton] = useState(false);

    // Listen for history changes
    useEffect(() => {
        // Check if there is history to go back to
        setShowBackButton(navigate.length > 1);
    }, [navigate]);

    // Function to determine the active link class
    const getActiveLinkClass = ({ isActive }) => isActive ? 'active' : '';

    const logout = async () => {
        await axios.post('http://127.0.0.1:8000/api/auth/token/logout/', null, { headers });
        handleLogout();
        navigate('/login');
    };

    return (
        <div className="app">
            <div className="sidebar">
                <h1>ComplySync</h1>
                <NavLink to="/policies" className={getActiveLinkClass}><button>Policies</button></NavLink>
                <NavLink to="/documents" className={getActiveLinkClass}><button>Documents</button></NavLink>
                <NavLink to="/groups" className={getActiveLinkClass}><button>Groups</button></NavLink>
                <NavLink to="/campaigns" className={getActiveLinkClass}><button>Campaigns</button></NavLink>
                {isAdmin && (
                    <NavLink to="/users" className={getActiveLinkClass}><button>Users</button></NavLink>
                )}
                <button onClick={logout}>Logout</button>
            </div>
            <div className="main-content">
                <div className="navbar">
                    {showBackButton && (
                        <button className="back-btn" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left-long"></i></button>
                    )}
                    <span><i className="fa-solid fa-user" ></i> {username}</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Layout;
