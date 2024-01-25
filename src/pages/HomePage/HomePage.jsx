import BannerActors from "../../components/BannerActors/BannerActors";
import BannerSunKing from "../../components/BannerSunKing/BannerSunKing";
import "./HomePage.scss";

function HomePage( {URL}) {
  return (
    <div className="home">
      <div className="home-filler home-filler1">
        <p>Welcome to the Monologue Competition 2024</p>
      </div>
    {/* Actors Banner */}
      <div className="home-card home-card1">
        <div className="home-card-actors">
          <BannerActors URL={URL} />
        </div>
      </div>

      <div className="home-filler home-filler2">
        <p>
          The proceed from this contest will be utilized towards children with
          disabilties.
        </p>
      </div>
    {/* Sun King Banner */}
      <div className="home-card home-card2 ">
        <BannerSunKing />
      </div>
    </div>
  );
}
export default HomePage;
