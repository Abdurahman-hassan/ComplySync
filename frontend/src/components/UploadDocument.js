import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

const UploadDocument = () => {
    const [uploadFilePage, setUploadFilePage] = useState('');

    useEffect(() => {
        axios.get(`${config.apiBaseUrl}/upload-pdf/`)
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


