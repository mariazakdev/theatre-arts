import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SunKingComponent.scss";
import img from "../../assets/images/fotor-2024010481259.png";

const URL = process.env.REACT_APP_BACKEND_URL;

function BanerComponent() {
  const [sunKingData, setSunKingData] = useState({
    id: 1,
    title: "",
    subtitle: "",
    content: "",
  });

useEffect(() => {
  // Fetch Sun King data from the server and update the state
  axios.get(`${URL}/sun-king`).then((response) => {
    setSunKingData(response.data[0]);
  });
}, []);

  return (
    <section className="baner">
      <div className="baner-text">
        <div className="baner-text-titles">
          <h2>{sunKingData.title}</h2>
          <h1>{sunKingData.subtitle}</h1>
        </div>
        <div className="baner-content">
          <p>{sunKingData.content}</p>
        </div>
      </div>
      <div className="baner-image">
        <img src={img} alt="Sun King Image" />
      </div>
    </section>
  );
}

export default BanerComponent;
