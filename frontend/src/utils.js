import { useState } from "react";
import axios from "axios";
import { useAuth } from "./App";
import { useNavigate } from "react-router-dom";

// Helper function to format date
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const useDelete = (url, id) => {

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const { authToken } = useAuth();
    const navigate = useNavigate();

    const deleteChild = async () => {
        try {
            const response = await axios.delete(url + id, {
                headers: { 'Authorization': `Token ${authToken}` }
            });
            console.log(response);
            setResponse(response);
            setError(null);
            navigate(-1);
        } catch (err) {
            console.error('Error fetching details:', err);
            setError(err.message);
        }
    };

    return { response, error, deleteChild };
};
