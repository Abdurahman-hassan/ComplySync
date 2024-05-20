import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const Login = () => {

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const startTime = performance.now();
        setIsLoading(true);
        try {
            const formData = {
                email: e.target.email.value, // Assuming email input has a name="email"
                password: e.target.password.value, // Assuming password input has a name="password"
            };

            const response = await axios.post('http://127.0.0.1:8000/api/auth/token/login/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            console.log(data);
            const token = data.auth_token;

            handleLogin(token);
            navigate('/policies');
        } catch (error) {
            console.error(error.message);
            if (error.response.data.non_field_errors === 'Unable to log in with provided credentials.') {
                setError('Invalid credentials');
            } else {
                setError(error.response.data.non_field_errors);
            }
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
        <div>
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h1>ComplySync</h1>
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
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={isLoading}>{isLoading ? <ThreeDots visible={true} height="50" width="50" color="#fff" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" /> : 'Login'}</button>
                </form>
                <Link to="/signup">Don't have an account? Sign up</Link>
            </div>
        </div>
    );
}

export default Login;