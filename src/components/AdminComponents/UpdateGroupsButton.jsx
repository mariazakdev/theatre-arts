import React, { useState } from 'react';
import axios from 'axios';
import useTopThree from '../../hooks/useTopThree';
import './UpdateGroupsButton.scss';

const UpdateGroupsButton = () => {
    const { groupedContestants } = useTopThree();
    const API_KEY = process.env.REACT_APP_API_KEY;
    const URL = process.env.REACT_APP_BACKEND_URL;

    const [alert, setAlert] = useState(null);

    const handleUpdateGroups = async () => {
        try {
            const response = await axios.put(`${URL}/update-groups`, { groupedContestants }, {
                headers: {
                    'Authorization': `${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            setAlert({ type: 'success', message: 'Groups updated successfully!' });
            console.log('Groups updated successfully:', response.data);
        } catch (error) {
            setAlert({ type: 'error', message: 'Error updating groups. Please try again.' });
            console.error('Error updating groups:', error);
        }
    };

    return (
        <div>
            {alert && (
                <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {alert.message}
                </div>
            )}
            <button onClick={handleUpdateGroups}>Update Groups</button>
        </div>
    );
};

export default UpdateGroupsButton;
