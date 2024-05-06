import React, { useState } from 'react';
import { useNavigate, useLocation } from'react-router-dom';
import axios from 'axios';
import '../styles/CreatePolicy.css';

const CreatePolicy = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { setNewPolicyCreated } = location.state || {};
    const [formData, setFormData] = useState({
        base_title: '',
        status: 'draft', // Assuming 'draft' is a valid status
        min_read_time: 0,
        allow_download: false,
        description: '',
    });
    const authToken = localStorage.getItem('authToken');
    const headers = {
        Authorization: `Token ${authToken}`,
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = name === 'min_read_time' ? Number(value) : value;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : newValue,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log('formData:', formData);
            const response = await axios.post('http://127.0.0.1:8000/api/policies/', formData, { headers });
            console.log('response:', response);
            if (setNewPolicyCreated) {
                setNewPolicyCreated(true);
            }
            navigate('/policies'); // Redirect to policies page after successful creation
        } catch (error) {
            console.error('Error creating policy:', error);
        }
    };

    return (
        <div className='create-policy-container'>
            <h2>Create Policy Page</h2>
            <form onSubmit={handleSubmit} className='create-policy-form'>
                <label>
                    Title:
                    <input
                        type="text"
                        name="base_title"
                        value={formData.base_title}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Minimum Read Time (minutes):
                    <input
                        type="number"
                        name="min_read_time"
                        value={formData.min_read_time}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Allow Download:
                    <input
                        type="checkbox"
                        name="allow_download"
                        checked={formData.allow_download}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreatePolicy;