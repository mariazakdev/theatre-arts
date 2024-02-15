
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import useTopThree from '../../hooks/useTopThree';
// import YouTube from 'react-youtube';
// import './UserProfile.scss';

// const URL = process.env.REACT_APP_BACKEND_URL;

// function UserProfile() {
//   const { actorId } = useParams();
//   const topThreeActors = useTopThree();
//   const [localActorData, setLocalActorData] = useState(null);
//   const [videoPaused, setVideoPaused] = useState(false);
//   const { groupedContestants, topThreeMessages } = useTopThree();
//   const [announce, setAnnounce] = useState(null);


// console.log('topThreeActors', topThreeActors);


//   useEffect(() => {
//     if (!actorId) {
//       console.error('No actor ID provided');
//       return;
//     }

//     const fetchActorData = async () => {
//       try {
//         const response = await axios.get(`${URL}/contestants/${actorId}`);
//         setLocalActorData(response.data);
//       } catch (error) {
//         console.error('Error fetching actor data:', error);
//       }
//     };

//     fetchActorData();
//   }, [actorId]);



//   useEffect(() => {
//     if (groupedContestants && groupedContestants.length > 0 && actorId) {
//       groupedContestants.forEach(group => {
//         group.forEach(contestant => {
//           if (contestant.id === parseInt(actorId)) {
//             setAnnounce(contestant.announce);
//           }
//         });
//       });
//     }
//   }, [groupedContestants, actorId]);
// console.log('announce', announce);


//   if (!localActorData) {
//     return <div>Loading...</div>;
//   }

//   const actor = localActorData;
//   const videoSrc = actor.url_video ? actor.url_video.replace('watch?v=', 'embed/') : '';



//   return (
//     <section className="user-profile">
//                   {announce && <div className="user-profile__top-three-announce"><h3>{announce}</h3></div>}

//       {actor && (
//         <div className="user-profile__wrapper">
//           <div className="video-container">
//             {videoSrc && (
//               <iframe
//                 src={videoSrc}
//                 title="YouTube video player"
//                 allowFullScreen
//                 className="video-frame"
//                 id="profileVideo"
               
//               ></iframe>
//             )}
//           </div>
//           <div className="user-info">
//             <div className="user-details">
//               <h2>{actor.name}</h2>
//               <p className="user-description">{actor.description}</p>
//               <p className="user-votes">Votes: {actor.votes}</p>
//             </div>
//             <div className="user-image-container">
//               <img src={actor.url_photo} alt={actor.name} className="user-headshot" />
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// export default UserProfile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import './UserProfile.scss';

const URL = process.env.REACT_APP_BACKEND_URL;

function UserProfile() {
  const { actorId } = useParams();
  const [localActorData, setLocalActorData] = useState(null);
  const [announce, setAnnounce] = useState(null);

  useEffect(() => {
    if (!actorId) {
      console.error('No actor ID provided');
      return;
    }

    const fetchActorData = async () => {
      try {
        const response = await axios.get(`${URL}/contestants/${actorId}`);
        setLocalActorData(response.data);
      } catch (error) {
        console.error('Error fetching actor data:', error);
      }
    };

    fetchActorData();
  }, [actorId]);

  useEffect(() => {
    if (localActorData && localActorData.groupedContestants) {
      localActorData.groupedContestants.forEach(group => {
        group.forEach(contestant => {
          if (contestant.id === parseInt(actorId)) {
            setAnnounce(contestant.announce);
          }
        });
      });
    }
  }, [localActorData, actorId]);

  if (!localActorData) {
    return <div>Loading...</div>;
  }

  const actor = localActorData;
  const videoSrc = actor.url_video ? actor.url_video.replace('watch?v=', 'embed/') : '';

  return (
    <section className="user-profile">
      {announce && <div className="user-profile__top-three-announce"><h3>{announce}</h3></div>}
      {actor && (
        <div className="user-profile__wrapper">
          <div className="video-container">
            {videoSrc && (
              <YouTube
                videoId={videoSrc.split('/').pop()}
                opts={{ playerVars: { autoplay: 1 } }}
                onReady={(event) => {
                  event.target.pauseVideo(); // Ensures video starts paused
                }}
                onStateChange={(event) => {
                  if (event.data === YouTube.PlayerState.PLAYING) {
                    setTimeout(() => {
                      event.target.pauseVideo();
                    }, 60000); // Pause at 60 seconds (1 minute)
                  }
                }}
              />
            )}
          </div>
          <div className="user-info">
            <div className="user-details">
              <h2>{actor.name}</h2>
              <p className="user-description">{actor.description}</p>
              <p className="user-votes">Votes: {actor.votes}</p>
            </div>
            <div className="user-image-container">
              <img src={actor.url_photo} alt={actor.name} className="user-headshot" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default UserProfile;
