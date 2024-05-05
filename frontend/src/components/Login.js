import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Login = () => {

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        fetch('http://127.0.0.1:8000/api/auth/token/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        }).then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            return response.json();

        }).then(data => {
            console.log(data);
            const token = data.auth_token;
            handleLogin(token);
            navigate('/home');
        }).catch(error => {
            console.log(error.message);
            setError(error.message);
        });
    };

    return (
        <div>
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                    />

                    {/* Display error message */}
                    {error && <p className="error-message">{ error }</p>}
                    <button type="submit">Log In</button>
                </form>
                <Link to="/signup">Don't have an account? Sign up</Link>
            </div>
        </div>
    );
}

export default Login;