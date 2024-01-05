// EditDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditDashBoard.scss';

function EditDashboard({ contestantId, toggleEditing }) {
  const [formData, setFormData] = useState({
    description: '',
    videoUrl: '',
  });

  useEffect(() => {
    const fetchContestantData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/contestants/${contestantId}`);
        const contestantData = response.data;

        setFormData({
          description: contestantData.description,
          videoUrl: contestantData.url_video,
        });
      } catch (error) {
        console.error('Error fetching contestant data:', error);
      }
    };

    if (contestantId) {
      fetchContestantData();
    }
  }, [contestantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:8000/contestants/${contestantId}`, {
        description: formData.description,
        videoUrl: formData.videoUrl,
      });

      // Handle success
      console.log('Contestant data updated successfully:', response.data);

    } catch (error) {
      // Handle error
      console.error('Error updating contestant data:', error);
    }
  };

  return (
    <section>
        <div className="edit-dashboard">
          <form className="edit-dashboard__form" onSubmit={handleFormSubmit}>
            <label className="edit-dashboard__form__label" htmlFor="description">
              Description:
            </label>
            <p>Edit your description.</p>
            <textarea
              className="edit-dashboard__form__textarea"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />

            <label className="edit-dashboard__form__label" htmlFor="videoUrl">
              Video URL:
            </label>
            <p>Videos can only be changed once every voting cycle</p>
            <input
              className="edit-dashboard__form__input"
              type="text"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
            />

            <button className="edit-dashboard__form__button" type="submit">
              Update
            </button>
          </form>
        </div>
 
    </section>
  );
}

export default EditDashboard;

