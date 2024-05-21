import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import useFetchDetails from "../useFetch";
import axios from "axios";
import config from "../config";

const UpdateGroup = () => {
    
    const navigate = useNavigate();
    const { isAdmin, authToken } = useAuth();
    const { groupId } = useParams();
    const { data: GroupDetails, error } = useFetchDetails(`${config.apiBaseUrl}/groups/`, groupId);
    const [groupName, setGroupName] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    // const [users, setUsers] = useState([]);
    // const [selectedUsers, setSelectedUsers] = useState([]);
    const headers = {
        Authorization: `Token ${authToken}`,
    };

    if (error) {
        console.log(error);
    }

    // useEffect(() => {
    //     // Fetch the list of users when the component mounts
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await axios.get('http://127.0.0.1:8000/api/auth/users/', { headers: { Authorization: `Token ${authToken}` } });
    //             console.log(response.data.results);
    //             setUsers(response.data.results);
    //         } catch (error) {
    //             console.error('Error fetching users:', error);
    //         }   
    //     };

    //     fetchUsers();
    // }, [authToken]);

    useEffect(() => {
        
        if (GroupDetails) {
            setGroupName(GroupDetails.group_name);
            // setSelectedUsers(GroupDetails.user_ids);
        }
    }, [GroupDetails]);

    // const handleUserSelection = (userId) => {
    //     // Add or remove user from selectedUsers array
    //     setSelectedUsers(prevSelectedUsers => {
    //         if (prevSelectedUsers.includes(userId)) {
    //             return prevSelectedUsers.filter(id => id !== userId);
    //         } else {
    //             return [...prevSelectedUsers, userId];
    //         }
    //     });
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            if (groupName !== GroupDetails.group_name) {
                await axios.put(`${config.apiBaseUrl}/groups/${groupId}/`, { group_name: groupName }, { headers });
            }

            // Assign users to the group using the new group ID
            // if (selectedUsers !== GroupDetails.user_ids) {
            //     await axios.put(`http://127.0.0.1:8000/api/groups/${groupId}/assign_users_to_group/`, { user_ids: selectedUsers }, { headers });
            // }

            navigate(-1);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <form style={{ maxWidth: '700px' }} className='create-group-form' onSubmit={handleSubmit}>
            <div className="head">
                <h2 style={{ marginBottom: '0px', textAlign: 'left' }} >Update Group</h2>
                <div className="update-and-delete">
                        {isAdmin && <button className='update-btn' onClick={() => navigate(`/groups/${groupId}/update/update-users`)}>Update Group Members</button>}
                        {isAdmin && <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ backgroundColor: isHovered ? 'rgb(169 7 7)' : 'rgb(225 82 82)' }} className="delete-btn" onClick={() => navigate(`/groups/${groupId}/update/delete-users`)}>Delete Group Member</button>}
                </div>
            </div>
            <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
                required
            />
            {/* <div className="user-selection-container">
                <h3>Select Users</h3>
                <div className="user-selection">
                    {users.map(user => (
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
                    ))}
                </div>
            </div> */}
            <button type="submit" className="create-group-submit">Update</button>
        </form>
    );

}

export default UpdateGroup; 