import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPlayer from "react-player";

import "./EditDashBoard.scss";

// NOTE ABOUT VIDEO. For each round manually adjust round === 1/2/3 etc line 16, 136

function EditDashboard({
  URL,
  contestantId,
  toggleEditing,
  updateContestantData,
  API_KEY,
}) {
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [contestantData, setContestantData] = useState({ round: 1 });
  const [charCount, setCharCount] = useState(0); // State to track character count

  const [formData, setFormData] = useState({
    description: "",
    videoUrl: "",
  });
  const [showVideoInput, setShowVideoInput] = useState(true); // State for controlling video input visibility

  useEffect(() => {
    const fetchContestantData = async () => {
      try {
        const response = await axios.get(`${URL}/contestants/${contestantId}`, {
          headers: { Authorization: `${API_KEY}` },
        });
        const fetchedContestantData = response.data;

        setContestantData(fetchedContestantData);
        setFormData({
          description: contestantData.description,
          videoUrl: contestantData.url_video,
        });
      } catch (error) {
        console.error("Error fetching contestant data:", error);
      }
    };

    if (contestantId) {
      fetchContestantData();
    }
  }, [contestantId]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      if (value.length <= 400) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setCharCount(value.length); // Update char count
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${URL}/contestants/${contestantId}`,
        {
          description: formData.description,
          videoUrl: formData.videoUrl,
        },
        { headers: { Authorization: `${API_KEY}` } }
      );

      // When successful, update the state
      console.log("Contestant data updated successfully:", response.data);
      setUpdateSuccess(true);

      setTimeout(() => {
        toggleEditing();
        setUpdateSuccess(false);
        updateContestantData();
      }, 3000);
    } catch (error) {
      // Handle error
      console.error("Error updating contestant data:", error);
      setUpdateError(error.message);
    }
  };

  const handleVideoSubmit = async () => {
    try {
      const response = await axios.post(
        `${URL}/contestants/${contestantId}/submit-video`,
        {
          videoUrl: formData.videoUrl,
        },
        { headers: { Authorization: `${API_KEY}` } }
      );
      // Update round to 2
      await axios.put(
        `${URL}/contestants/${contestantId}/update-round`,
        { round: 2 },
        { headers: { Authorization: `${API_KEY}` } }
      );
      setFormData((prevData) => ({
        ...prevData,
        videoUrl: "", // Clear the video URL input
      }));

      // Update the contestant data
      updateContestantData();
      // Hide the video input immediately after successful submission
      setShowVideoInput(false);
    } catch (error) {
      console.error("Error submitting video:", error);
      setUpdateError(error.message);
    }
  };

  return (
    <section className="edit">
              <h2 className="edit-dashboard__title">Edit Dashboard</h2>

      <div className="edit-dashboard">
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
          <div className="form-container__char-count">
              {charCount} / 400 characters
            </div>
          <textarea
            className="edit-dashboard__form__textarea"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            maxLength="600"

          />
          <button className="edit-dashboard__form__button" type="submit">
            Update Description
          </button>
          {contestantData.round === 2 && showVideoInput && ( // Only show the video URL input and button if round === 1
            <>
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
              {/* Video preview */}
              {formData.videoUrl && (
                <div className="edit-dashboard__video-preview">
                  <ReactPlayer
                  url={formData.videoUrl}
                  controls
                  width="100%"
                  height="100%"
                />
               
                </div>
              )}
              <button
                className="edit-dashboard__form__button"
                type="button" // Use type="button" for the video submit button
                onClick={handleVideoSubmit}
              >
                Submit Video
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

export default EditDashboard;
