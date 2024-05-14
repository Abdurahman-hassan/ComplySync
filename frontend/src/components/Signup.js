import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationSuccess from './RegistrationSuccess';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const Signup = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        re_password: '',
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.re_password) {
            setError("Passwords don't match!");
            return;
        }
        const startTime = performance.now();
        setIsLoading(true); // Set loading state to true before fetching
        setError(null); // Clear any previous error

        try {
            await axios.post('http://127.0.0.1:8000/api/auth/users/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setIsRegistered(true);
            setUserEmail(formData.email);

        } catch (error) {
            console.error(error.message);
            setError("Registration failed. Please try again.");
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

    if (isRegistered) {
        return <RegistrationSuccess userEmail={userEmail} />
    }

    return (
        <div className="signup-container">
            <form className='signup-form' onSubmit={handleSubmit}>
                <h1>ComplySync</h1>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                />
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
                <input
                    type="password"
                    name="re_password"
                    value={formData.re_password}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    required
                />

                {/* Display error message */}
                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={isLoading}>{isLoading ? <ThreeDots visible={true} height="50" width="50" color="#fff" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" /> : 'Sign Up'}</button>
            </form>
            <Link to="/login">Already have an account? Login</Link>
        </div>
    );
}

export default Signup;