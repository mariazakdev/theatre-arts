// import React, { useEffect } from "react";
// import "./SunKingComponent.scss";
// import img from "../../assets/images/fotor-2024010481259.png";

// function BanerComponent() {
//   useEffect(() => {
//     //Fade-in class after the component mounts
//     const banerSection = document.querySelector(".baner");
//     banerSection.classList.add("fade-in");
//   }, []);

//   return (
//     <section className="baner">
//       <div className="baner-text">
//         <div className="baner-text-titles">
//           <h2>BANER PRODUCTIONS PRESENTS</h2>
//           <h1>THE SUN KING</h1>
//         </div>
//         <div className="baner-content">
//           <p>
//             In the Sun King play, radiant beams of light illuminate the royal
//             court. Vivamus auctor lacus id justo faucibus, in ullamcorper justo
//             fermentum. Nulla facilisi. Etiam ultrices urna in lectus cursus, ac
//             interdum nisi vestibulum. Quisque vel ligula vel est facilisis
//             gravida. Fusce nec tortor id augue volutpat tincidunt. Maecenas
//             hendrerit dui vitae bibendum tempor. The Sun King's presence on
//             stage is like a celestial dance, casting warmth and brilliance upon
//             the characters. Suspendisse potenti. Nunc euismod risus id mauris
//             vehicula, sit amet dapibus ligula fermentum. Ut lacinia augue a
//             tincidunt ullamcorper. Sed dictum dolor a bibendum lacinia. Morbi
//             fermentum mi in justo tincidunt, id consectetur velit ultrices. As
//             the plot unfolds, the Sun King's influence becomes a central theme,
//             guiding the destiny of the characters. Integer ut justo ac sem
//             tincidunt sagittis nec id odio. Aenean eu urna vel erat hendrerit
//             varius. Curabitur vel sapien eu tortor vulputate sodales. Vestibulum
//             sollicitudin mauris vel augue gravida, vitae cursus quam dapibus.
//             The Sun King's radiance echoes through the dialogues, infusing the
//             scenes with a golden glow. Nam tincidunt justo vel luctus bibendum.
//             Aliquam erat volutpat. Duis eu nisl et nunc cursus vehicula.
//             Phasellus eu leo vitae orci convallis ultricies. Sed vestibulum
//             lacus at tincidunt feugiat. The play's atmosphere resonates with the
//             Sun King's regal aura, enveloping the audience in a majestic
//             experience. Curabitur vitae libero ut velit scelerisque varius.
//             Nulla facilisi. Sed eget odio nec sapien vestibulum tristique.
//             Quisque et justo nec libero fermentum tincidunt. The characters,
//             like planets orbiting the Sun King, revolve around the central theme
//             of power and illumination. Vivamus quis massa at lacus volutpat
//             ullamcorper id id nisl. Proin nec urna non justo sagittis fringilla
//             ut ac mauris.
//           </p>
//         </div>
//       </div>
//       <div className="baner-image">
//         <img src={img} alt="Sun King Image" />
//       </div>
//     </section>
//   );
// }

// export default BanerComponent;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SunKingComponent.scss";
import img from "../../assets/images/fotor-2024010481259.png";

const URL = process.env.REACT_APP_BACKEND_URL;

console.log(URL);
function BanerComponent() {
  const [sunKingData, setSunKingData] = useState({
    id: 1,
    title: "",
    subtitle: "",
    content: "",
  });

useEffect(() => {
  // Fetch Sun King data from the server and update the state
  axios.get(`http://localhost:8000/sun-king`).then((response) => {
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
