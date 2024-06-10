import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminSunKing.scss";


function AdminSunKingEdit({ URL}) {
  const [sunKingData, setSunKingData] = useState({
    id: 1,
    title: "",
    subtitle: "",
    content: "",
  });
  const [flashMessage, setFlashMessage] = useState(null);
  useEffect(() => {
    // Fetch Sun King data from the server and update the state
    axios.get(`${URL}/sun-king`).then((response) => { 
      setSunKingData(response.data[0]);
    });
  }, []);

  const handleChange = (e) => {
    setSunKingData({
      ...sunKingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send updated Sun King data to the server
      await axios.put(`${URL}/sun-king`, { newData: sunKingData });
      setFlashMessage("Sun King data updated successfully!");
      console.log("Sun King data updated successfully!");
    } catch (error) {
      console.error("Error updating Sun King data:", error);
    }
  };

  return (
    <div className="form-sunking">
      {flashMessage && <div className="flash-message">{flashMessage}</div>}

      <h2>Edit Sun King Data</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={sunKingData.title}
          onChange={handleChange}
        />

        <label htmlFor="subtitle">Subtitle:</label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          value={sunKingData.subtitle}
          onChange={handleChange}
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={sunKingData.content}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Update Sun King Data</button>
      </form>
    </div>
  );
}

export default AdminSunKingEdit;
