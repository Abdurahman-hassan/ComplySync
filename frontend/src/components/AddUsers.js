import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import '../styles/AddUsers.css';
import { ThreeDots } from "react-loader-spinner";
import config from '../config';

function AddUsers() {
    const { authToken } = useAuth();
    const [file, setFile] = useState(null);
    const [manualEmails, setManualEmails] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(''); // Clear any existing errors
    };

    const handleManualEmailChange = (event) => {
        setManualEmails(event.target.value);
        setError(''); // Clear any existing errors
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const validateAndExtractEmails = (text) => {
        const allLines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
        const header = allLines[0].trim();

        if (header.toLowerCase() !== 'emails') {
            setErrorMessage('Invalid CSV file, CSV file must have a header named "Emails"');
            return null;
        }

        // Validate each email
        const emails = allLines.slice(1).map(line => line.split(',')[0].trim());
        const invalidEmails = emails.filter(email => !validateEmail(email));

        if (invalidEmails.length > 0) {
            setError(`Invalid emails: ${invalidEmails.join(', ')}`);
            return null;
        }

        return emails;
    };

    const handleUpload = async () => {
        setError(''); // Clear any existing errors
        let emails;

        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target.result;
                emails = validateAndExtractEmails(text);
                if (emails) {
                    await uploadEmails(emails);
                }
            };
            reader.readAsText(file);
        } else if (manualEmails.trim() !== '') {
            const manualEmailList = manualEmails.split(/,|\r\n|\n/).map(email => email.trim());
            const invalidManualEmails = manualEmailList.filter(email => !validateEmail(email));
            
            if (invalidManualEmails.length > 0) {
                setError(`Invalid manually entered emails: ${invalidManualEmails.join(', ')}`);
                return;
            }

            emails = manualEmailList;
            await uploadEmails(emails);
        } else {
            setError('Please select a CSV file or enter emails manually!');
        }
    };

    const uploadEmails = async (emails) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        };

        const startTime = performance.now();
        setIsLoading(true);
        try {
            console.log("emails", emails);
            const response = await axios.post(`${config.apiBaseUrl}/bulk-create/`, { emails: emails }, { headers });
            console.log('Server Response:', response);
            if (response.status === 201) {
                setSuccessMessage(`Successfully uploaded ${emails.length} emails!`);
                setTimeout(() => navigate(`/users`), 3000);
            } else {
                setError(response.data.detail);
            }
        } catch (error) {
            console.error('Error uploading emails:', error.response ? error.response.data : error);
            setErrorMessage(error.response? error.response.data.detail : error);
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
        <div className='email-uploader'>
            <div>
                <input type="file" onChange={handleFileChange} accept=".csv" />
                <p>or</p>
                <textarea
                    placeholder="Enter emails, separated by commas or new lines"
                    value={manualEmails}
                    onChange={handleManualEmailChange}
                ></textarea>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button onClick={handleUpload} disabled={isLoading}>{isLoading ? <ThreeDots visible={true} height="50" width="50" color="#fff" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" /> : 'Add users and send emails'}</button>
            <p>Please use a CSV file with a header "Emails" or manually enter the emails in the textarea.</p>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
}

export default AddUsers;
