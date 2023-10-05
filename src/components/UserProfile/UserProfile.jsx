import React from 'react';
import './UserProfile.scss';
import VideoCard from '../VideoCard/VideoCard';


function UserProfile() {

    const user= {
        name: "Bob Smith",
        headshot: "https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80",
        description: " Theatre is my life. I have a passion for performing",
        videos: [
            {
              url: "https://www.facebook.com/mariazakofficial/videos/3133484773558411",
              title: "Video 1",
              description: "Description for video 1"
            },
            {
              url: "https://www.youtube.com/watch?v=6fmWXinZTkY",
              title: "Video 2",
              description: "Description for video 2"
            },
            {
              url: "https://www.instagram.com/reel/Cq1deVYpo1u/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
              title: "Video 3",
              description: "Description for video 3"
            }
          ]
    }
  return (
    <div className="user-profile">
        <h2>{user.name}</h2>
      <img src={user.headshot} alt="User Headshot" className="user-headshot" />
      <p className="user-description">{user.description}</p>
      <div className="user-videos">
        {user.videos.map(video => (
            <VideoCard key={video} video={video} />       
             ))}
      </div>
    </div>
  );
}

export default UserProfile;
