import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUsersList.scss';


function AdminUsersList({URL, API_KEY}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${URL}/users`,
        {
            headers: {
                Authorization: `${API_KEY}`,
              },

        }); // Update the URL based on your backend endpoint
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (firebaseId) => {
    try {
      await axios.delete(`${URL}/users/${firebaseId}`,{

        headers: {
            Authorization: `${API_KEY}`,
          },
      }); // Update the URL based on your backend endpoint
      setUsers(users.filter(user => user.firebase_auth_id !== firebaseId));
    } catch (error) {
      setError('Error deleting user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='users-list'>
      <h1>Admin Users List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email}
            <button onClick={() => deleteUser(user.firebase_auth_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsersList;
