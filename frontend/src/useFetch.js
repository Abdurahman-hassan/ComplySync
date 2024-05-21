import { useState, useEffect } from "react";
import { useAuth } from './App';
import axios from 'axios';

const useFetchDetails = (url, id) => {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { authToken } = useAuth();

    useEffect(() => {
            const fetchDetails = async () => {
                try {
                    const response = await axios.get(`${url}${id}/`, {
                        headers: { 'Authorization': `Token ${authToken}` }
                    });
                    console.log(response.data);
                    setData(response.data);
                    setError(null);
                } catch (err) {
                    console.error('Error fetching details:', err);
                    setError(err.message);
                }
            };
    
            fetchDetails();
    }, [url, id, authToken]);

    return { data, error };
}

export default useFetchDetails;