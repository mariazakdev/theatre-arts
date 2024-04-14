import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const [formData, setFormData] = useState({
    description: "",
    videoUrl: "",
  });
  const [videoInputVisible, setVideoInputVisible] = useState(true);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [showVideoConfirmation, setShowVideoConfirmation] = useState(false);
  const [videoConfirmed, setVideoConfirmed] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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

        // Hide the video input immediately
    setVideoInputVisible(false);

      setFormData((prevData) => ({
        ...prevData,
        videoUrl: "", // Clear the video URL input
      }));

      // Update the contestant data
      updateContestantData();
    } catch (error) {
      console.error("Error submitting video:", error);
      setUpdateError(error.message);
    }
  };
  const handleVideoChange = (e) => {
    const videoUrl = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      videoUrl: videoUrl,
    }));
    setVideoPreviewUrl(videoUrl); // Set the video preview URL
    setShowVideoConfirmation(true); // Show the video confirmation message
  };

  return (
    <section className="edit">
      {/* Description - Can edit at any time.  */}
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

          {/* Video URL - Only show if round === 1 or updated round */}
          {contestantData.round === 1 && videoInputVisible && (
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
                onChange={handleVideoChange}
              />
              {videoPreviewUrl && (
                <div>
                  <ReactPlayer
                    url={videoPreviewUrl}
                    controls
                    width="100%"
                    height="300px"
                  />
                  <p>Video Preview</p>
                </div>
              )}
              {showVideoConfirmation && !videoConfirmed && (
                <button
                  className="edit-dashboard__form__button"
                  type="button"
                  onClick={() => setVideoConfirmed(true)}
                >
                  Confirm Video
                </button>
              )}
            </>
          )}



          <button className="edit-dashboard__form__button" type="submit">
            Update
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditDashboard;
