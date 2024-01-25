import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditDashBoard.scss';

function EditDashboard({ URL, contestantId, toggleEditing,  updateContestantData }) {

  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    videoUrl: '',
  });

  useEffect(() => {
    const fetchContestantData = async () => {
      try {
        const response = await axios.get(`${URL}/contestants/${contestantId}`);
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
      const response = await axios.post(`${URL}/contestants/${contestantId}`, {
        description: formData.description,
        videoUrl: formData.videoUrl,
      });

      // When successful, update the state
      console.log('Contestant data updated successfully:', response.data);
      setUpdateSuccess(true);

    setTimeout(() => {
      toggleEditing();
      setUpdateSuccess(false); 
      updateContestantData();
    }, 3000); 


    } catch (error) {
      // Handle error
      console.error('Error updating contestant data:', error);
      setUpdateError(error.message);
    }
  };

  return (
    <section className='edit'>

        <div className="edit-dashboard">
        <h2 className="edit-dashboard__title">Edit Dashboard</h2>
        {updateSuccess && (
          <p className="edit-dashboard__success-flash">
            Update successful! {/* You can customize this message */}
          </p>
        )}
        {updateError && <p className="edit-dashboard__error">{updateError}</p>}

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

