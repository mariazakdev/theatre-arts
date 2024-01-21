import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./SunKingSnippetComponent.scss";
import img from "../../assets/images/fotor-2024010481259.png";

function SunKingSnippetComponent() {


  return (
    <section className="baner-snippet">


      <div className="baner-snippet-text">
        <div className="titles">
          <h2>BANER PRODUCTIONS PRESENTS</h2>
          <h1>THE SUN KING</h1>
        </div>
        <div className="baner-content-snippet">
          <p>
            In the Sun King play, radiant beams of light illuminate the royal
            court. Vivamus auctor lacus id justo faucibus, in ullamcorper justo
            fermentum. Nulla facilisi. Etiam ultrices urna in lectus cursus, ac
            interdum nisi vestibulum...
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

export default SunKingSnippetComponent;
