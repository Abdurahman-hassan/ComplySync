import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EmailUploader.css';

function EmailUploader() {
    const [file, setFile] = useState(null);
    const [manualEmails, setManualEmails] = useState('');
    const [error, setError] = useState('');

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
            alert('CSV file must have a header named "Emails"');
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
        const token = localStorage.getItem('authToken');  // Replace with actual token or use environment variables
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/bulk-create/', { emails }, { headers });
            console.log('Server Response:', response.data);
        } catch (error) {
            console.error('Error uploading emails:', error.response ? error.response.data : error);
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
            <button onClick={handleUpload}>Upload and Send Emails</button>
            <p>Please use a CSV file with a header "Emails" or manually enter the emails in the textarea.</p>
        </div>
    );
}

export default EmailUploader;
