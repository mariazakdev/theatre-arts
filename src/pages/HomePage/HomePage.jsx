import BannerActors from "../../components/BannerActors/BannerActors";
import BannerSunKing from "../../components/BannerSunKing/BannerSunKing";
import VotingButtons from "../../components/VotingComponent/VotingButtons";
import ReactPlayer from 'react-player';

import "./HomePage.scss";

function HomePage( {URL, API_KEY}) {
  return (
    <div className="home">
      <div className="home-filler home-filler1">
        <h3>Welcome to the Monologue Contest (CBMC)</h3>
        <h4>Open to every individual from all age group, ethnicity and gender.
This Contest is only in English, with the solid understanding that people from every walk 
of life and culture may have specific accents or expressions that are either inherent or
 cultivated and there is no norm which could benchmark creativity.
It is expected that any form of preference or prejudice based on culture, 
religion or gender will not influence the judging of individual acts. </h4>
      </div>

    {/* Actors Banner */}
      <div className="home-card home-card1">
        <div className="home-card-actors">
          {/* <BannerActors URL={URL} API_KEY={API_KEY}/> */}
          
        </div>
       
      </div>
      <div className="home-promo-video home-filler-video">
        <ReactPlayer url='https://youtu.be/118hgexak-A' controls={true} />

    

        </div>
      <div className="home-filler home-filler2">
        {/* <h3>
          The proceed from this contest will be utilized towards children with
          disabilties.
        </h3> */}
        <h4>Proceeds from this contest will be utilized to benefit children with Learning Disabilities.
(It is estimated that in Canada over 4% of children have recognizable learning disabilities 
whereas the actual numbers could be a lot more as in neighbouring USA it is estimated that 1 out 
of 5 children have this condition. Our schools are not fully equipped to serve this population as 
well we are not equipped with substantial financial resources to tackle this and since the degree of 
variance in every child and his/her ability may differ, the child may quite easily be misdiagnosed or 
fall through the crack or be the subject of neglect.)
          </h4>
      </div>
    {/* Sun King Banner */}
      <div className="home-card home-card2 ">
        <BannerSunKing API_KEY={API_KEY}/>
      </div>
    </div>
  );
}
export default HomePage;
