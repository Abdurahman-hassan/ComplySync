import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import useFetchDetails from "../useFetch";
import axios from "axios";

const UpdateGroup = () => {
    
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const { groupId } = useParams();
    const { data: GroupDetails, error } = useFetchDetails("https://api.greencoder.tech/api/groups/", groupId);
    const [groupName, setGroupName] = useState('');
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
    //             const response = await axios.get('https://api.greencoder.tech/api/auth/users/', { headers: { Authorization: `Token ${authToken}` } });
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
                await axios.put(`https://api.greencoder.tech/api/groups/${groupId}/`, { group_name: groupName }, { headers });
            }

            // Assign users to the group using the new group ID
            // if (selectedUsers !== GroupDetails.user_ids) {
            //     await axios.put(`https://api.greencoder.tech/api/groups/${groupId}/assign_users_to_group/`, { user_ids: selectedUsers }, { headers });
            // }

            navigate(-1);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <form className='create-group-form' onSubmit={handleSubmit}>
            <h2>Update Group</h2>
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