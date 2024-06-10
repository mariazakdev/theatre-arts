import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const generatePDF = () => {
    const input = document.getElementById('pdf-content');
    if (input) {
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("current_users_list.pdf");
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    } else {
        console.error('Error: PDF content element not found.');
    }
};
  return (
    <div className='users-list'>
      <h1>Admin Users List</h1>
      <button onClick={generatePDF}>Save to PDF</button>
                <div id="pdf-content">
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email}
            <button onClick={() => deleteUser(user.firebase_auth_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div></div>
  );
}

export default AdminUsersList;
