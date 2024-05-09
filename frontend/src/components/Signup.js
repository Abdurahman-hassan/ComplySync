import React, { useState } from 'react';
import { Link } from'react-router-dom';
import RegistrationSuccess from './RegistrationSuccess';

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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.re_password) {
            alert('Passwords do not match!');
            return;
        }
        fetch('http://127.0.0.1:8000/api/auth/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                re_password: formData.re_password,
            }),
        }).then(response => {
            // console.log(response);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            setIsRegistered(true);
            setUserEmail(formData.email);
            // return response.json();

        }).catch(error => {
            console.log(error);
            setError("Registration failed. Please try again.");
        });
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
                {error && <p className="error-message">{ error }</p>}

                <button type="submit">Sign Up</button>
            </form>
            <Link to="/login">Already have an account? Login</Link>
        </div>
    );
}

export default Signup;