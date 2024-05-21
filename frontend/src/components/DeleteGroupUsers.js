import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../App";
import { ThreeDots } from "react-loader-spinner";
import config from "../config";

const DeleteGroupUsers = () => {

    const { authToken } = useAuth();
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const minimumLoadingTime = 500;

    useEffect(() => {
        // Fetch the list of users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/auth/users/`, {
                    headers: { 'Authorization': `Token ${authToken}` }
                });
                console.log(response.data.results);
                const filteredUsers = response.data.results.filter(user => user.is_active && user.groups.includes(parseInt(groupId)));
                console.log("fil", filteredUsers);
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [authToken, groupId]);

    const handleUserSelection = (userId) => {
        // Add or remove user from selectedUsers array
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                console.log([...prevSelectedUsers, userId]);
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleDeleteUsers = async () => {
        const data = {
            user_ids: selectedUsers
        }

        const startTime = performance.now();
        setIsLoading(true);
        try {
            const response = await axios.delete(`${config.apiBaseUrl}/groups/${groupId}/assign_users_to_group/`, {
                headers: { 'Authorization': `Token ${authToken}` },
                data
            });
            console.log(response.data);
            setErrorMessage('');
            setSuccessMessage('Selected members deleted successfully!');
            setTimeout(() => navigate(`/groups/${groupId}/`), 3000);
        } catch (error) {
            console.error('Error deleting group members:', error);
            if (error.response.data.detail === 'user_ids are required.') {
                setErrorMessage('You have to select some members to be deleted');
            }
            // setErrorMessage('Error deleting group members!');
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
        <form className='create-group-form' onSubmit={handleSubmit}>
            <div className="head">
                <h2 >Delete Group Members</h2>
            </div>
            <div className="user-selection-container">
                <h3>Select Users</h3>
                <div className="user-selection">
                    { users.length > 0 ? (
                        users.map(user => (
                            <div className="user-checkbox" key={user.id}>
                                <input
                                    id={`user-checkbox-${user.id}`}
                                    type="checkbox"
                                    value={user.id}
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserSelection(user.id)}
                                />
                                <label htmlFor={`user-checkbox-${user.id}`}>
                                    {user.email}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>The group is empty.</p>
                    )
                    }
                </div>
            </div>
            <button 
                onClick={handleDeleteUsers}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ backgroundColor: isHovered ? '#920000' : 'rgb(217 42 42)', color: '#fff', transition: 'background-color 0.3s ease', display: 'flex', justifyContent: 'center' }}
                className="delete-btn"
                disabled={isLoading}>{isLoading ? <ThreeDots visible={true} height="50" width="50" color="#fff" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" /> : 'Delete selected members'}
            </button>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
    );
}

export default DeleteGroupUsers;