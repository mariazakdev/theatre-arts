import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import img from "../../assets/images/fotor-2024010481259.png";
import "./BannerSunKing.scss";

const URL = process.env.REACT_APP_BACKEND_URL;

function BannerSunKing() {
  const [sunKingData, setSunKingData] = useState({
    id: 1,
    title: "",
    subtitle: "",
    content: "",
  });

  useEffect(() => {
    axios.get(`${URL}/sun-king`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setSunKingData(response.data[0]);
        } else {
          console.error("No data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <section className="baner-snippet">
      <div className="baner-snippet-text">
        <div className="titles">
          <h2>{sunKingData.title}</h2>
          <h1>{sunKingData.subtitle}</h1>
        </div>
        <div className="baner-content-snippet">
          <p>
            {sunKingData.content}
          </p>
          <Link to="/sun-king">
            <button className="card-button card-button2">Go to Sun King</button>
          </Link>
        </div>
      </div>
      <div className="baner-snippet-image">
        <img src={img} alt="Sun King" />
      </div>
    </section>
  );
}

export default BannerSunKing;
