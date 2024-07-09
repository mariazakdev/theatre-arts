import React, { useState } from 'react';
import axios from 'axios';
import useTopThree from '../../hooks/useTopThree';
import './UpdateGroupsButton.scss';

const UpdateGroupsButton = () => {
    const { groupedContestants } = useTopThree();
    const API_KEY = process.env.REACT_APP_API_KEY;
    const URL = process.env.REACT_APP_BACKEND_URL;

    const [alert, setAlert] = useState(null);

    const handleUpdateRound = async () => {
        try {
            const response = await axios.post(`${URL}/contestants/regroup`, { groupedContestants }, {
                headers: {
                    headers: { Authorization: `${API_KEY}` },

                },
            });
            alert('Round and groups updated successfully');
        } catch (error) {
            setAlert({ type: 'error', message: 'Error updating groups. Please try again.' });
            console.error('Error updating groups:', error);
        }
    };

    return (
        <div>
       <button onClick={handleUpdateRound}>
      Update Round and Groups
    </button>        </div>
    );
};

export default UpdateGroupsButton;
