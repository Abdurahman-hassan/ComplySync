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
                    const response = await axios.get(url + id, {
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

    // useEffect(() => {
    //     const abortCont = new AbortController();
    //     fetch(url, { signal: abortCont.signal })
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw Error('could not fetch the data for that resource');
    //             }
    //             return res.json();
    //         })
    //         .then(data => {
    //             setData(data);
    //             setError(null);
    //         })
    //         .catch(err => {
    //             if (err.name === 'AbortError') {
    //                 console.log('fetch aborted');
    //             }
    //             setError(err.message);
    //         })
    //         return () => abortCont.abort();
    // }, [url]);

    return { data, error };
}

export default useFetchDetails;