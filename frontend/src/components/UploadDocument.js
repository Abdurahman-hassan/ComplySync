// import React from 'react';
// import axios from 'axios';
// import { useState, useEffect } from'react';
// import { useAuth } from '../App';

// const UploadDocument = () => {

//     const languages = [
//         { id: 'en', name: 'English' },
//         { id: 'es', name: 'Spanish' },
//         { id: 'fr', name: 'French' },
//         { id: 'de', name: 'German' },
//         { id: 'it', name: 'Italian' },
//         { id: 'pt', name: 'Portuguese' },
//         { id: 'ru', name: 'Russian' },
//         { id: 'zh', name: 'Chinese' },
//         { id: 'ja', name: 'Japanese' },
//         { id: 'ko', name: 'Korean' },
//         { id: 'ar', name: 'Arabic' },
//         { id: 'hi', name: 'Hindi' },
//         { id: 'bn', name: 'Bengali' },
//         { id: 'pa', name: 'Punjabi' },
//         { id: 'te', name: 'Telugu' },
//         { id: 'mr', name: 'Marathi' },
//         { id: 'ta', name: 'Tamil' },
//         { id: 'ur', name: 'Urdu' },
//         { id: 'gu', name: 'Gujarati' },
//         { id: 'kn', name: 'Kannada' },
//         { id: 'or', name: 'Odia' },
//         { id: 'ml', name: 'Malayalam' },
//         { id: 'my', name: 'Burmese' },
//         { id: 'th', name: 'Thai' },
//         { id: 'vi', name: 'Vietnamese' },
//         { id: 'id', name: 'Indonesian' },
//         { id: 'tl', name: 'Filipino' },
//         { id: 'ms', name: 'Malay' },
//         { id: 'sw', name: 'Swahili' },
//         { id: 'am', name: 'Amharic' },
//         { id: 'yo', name: 'Yoruba' },
//         { id: 'ha', name: 'Hausa' },
//         { id: 'zu', name: 'Zulu' },
//         { id: 'xh', name: 'Xhosa' },
//         { id: 'st', name: 'Sesotho' },
//         { id: 'sn', name: 'Shona' },
//         { id: 'so', name: 'Somali' },
//         { id: 'mg', name: 'Malagasy' },
//         { id: 'km', name: 'Khmer' },
//         { id: 'lo', name: 'Lao' },
//         { id: 'ne', name: 'Nepali' },
//         { id: 'si', name: 'Sinhala' },
//         { id: 'ka', name: 'Georgian' }
//     ];

//     const [policies, setPolicies] = useState([]);
//     const [selectedLanguage, setSelectedLanguage] = useState('');
//     const [selectedPolicy, setSelectedPolicy] = useState('');
//     const { authToken } = useAuth();

//     const [formData, setFormData] = useState({
//         language: '',
//         policy: '',
//         localized_title: '',
        
//     });

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         if (type === 'file') {
//             setFormData({
//                 ...formData,
//                 [name]: files[0], // Set the file object for file inputs
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 [name]: value, // Set the value for other input types
//             });
//         }
//     };

//     useEffect(() => {
//         // Fetch policies
//         axios.get('https://api.greencoder.tech/api/policies/')
//             .then(response => {
//                 console.log(response.data.results);
//                 setPolicies(response.data.results);
//             })
//             .catch(error => console.error('Error fetching policies:', error));
//     }, []);

//     const handleUpload = async (event) => {
//         event.preventDefault();
//         const data = new FormData(event.target);

//         // Append form data from state
//         Object.keys(formData).forEach((key) => {
//             data.append(key, formData[key]);
//         });
    
//         try {
//             console.log(formData);
//             const response = await axios.post('https://api.greencoder.tech/api/upload-pdf/', formData, {
//                 headers: {
//                     'Authorization': `Token ${authToken}`,
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             // Handle successful upload here
//             console.log(response.data);
//             // Redirect or show a success message
//         } catch (error) {
//             console.error('Error uploading document:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleUpload}>
//             <label htmlFor="language">Language:</label>
//             <select
//                 id="language"
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//                 required
//             >
//                 <option value="">Select a Language</option>
//                 {languages.map((language) => (
//                     <option key={language.id} value={language.id}>
//                         {language.name}
//                     </option>
//                 ))}
//             </select>

//             <label htmlFor="title">Title:</label>
//             <input type="text" id="title" name="localized_title" placeholder="Document Title" required />

//             <label htmlFor="document">Document:</label>
//             <input type="file" id="document" name="document" onChange={handleChange} required />

//             <label htmlFor="policy">Policy:</label>
//             <select
//                 id="policy"
//                 value={selectedPolicy}
//                 onChange={(e) => setSelectedPolicy(e.target.value)}
//                 required
//             >
//                 <option value="">Select a Policy</option>
//                 {policies.map((policy) => (
//                     <option key={policy.id} value={policy.id}>
//                         {policy.base_title}
//                     </option>
//                 ))}
//             </select>

//             <button type="submit">Upload Document</button>
//         </form>
//     );
// }

// export default UploadDocument;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UploadDocument = () => {
    const [uploadFilePage, setUploadFilePage] = useState('');

    useEffect(() => {
        axios.get('https://api.greencoder.tech/api/upload-pdf/')
            .then(response => {
                console.log(response);
                setUploadFilePage(response.data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div dangerouslySetInnerHTML={{ __html: uploadFilePage }} />
    );
}

export default UploadDocument;


