import ActorsSnippetComponent from "../../components/ActorsSnippetComponent/ActorsSnippetComponent";
import SunKingSnippetComponent from "../../components/SunKingSnippetComponent/SunKingSnippetComponent";
import { Link } from "react-router-dom";

import "./HomePage.scss";


function HomePage() {
  return (
    <div className="home">
      <div className="home-filler home-filler1">
        <p>Welcome to the Monologue Competition 2024</p>
      </div>
      
      <div className="home-card home-card1">
      <div className="home-card-actors">
        <ActorsSnippetComponent/>
        </div>  
    
      </div>
      
      <div className="home-filler home-filler2">
      <p>The proceed from this contest will be utilized towards children with disabilties ( varying abilities )</p>

      </div>
      
      <div className="home-card">
        <SunKingSnippetComponent/>
     
      </div>
    </div>
  );
}
export default HomePage;
