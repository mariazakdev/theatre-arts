import React from 'react';
import "./Body.scss";
import Featured from '../Featured/Featured';
import Information from '../Information/Information';
import BanerComponent from '../BanerComponent/BanerComponent';
import SponsorComponent from "../SponsorComponent/SponsorComponent"
import FeaturedGallery from '../FeaturedGallery/FeaturedGallery';

function Body() {
  return (
    <div className="body-content">
      <Featured/>
      <Information/> 
      <BanerComponent/>
      <SponsorComponent/>
      <FeaturedGallery/>
    </div>
  );
}

export default Body;