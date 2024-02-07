import { useState, useEffect } from 'react';
import axios from 'axios';

const useVoteTimer = (currentUser, actorId, URL) => {
  const [userIdData, setUserIdData] = useState(null);
  const [votesResponse, setVotesResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let userDataResponse;
      let votesResponse;

      try {
        if (currentUser) {
          // Fetch user data
          userDataResponse = await axios.get(`${URL}/users/${currentUser.uid}`);
          const userData = userDataResponse.data;
          // Find the user id
          if (userData.user) {
            setUserIdData(userData.user.id);
          }
        }

        // Post vote using the user data
        if (userIdData) {
          const votesData = {
            userId: userIdData,
            contestantId: actorId,
            numberOfVotes: 1,
          };

          votesResponse = await axios.post(`${URL}/votes`, votesData);

          if (votesResponse.status === 201) {
            console.log('/votes recorded a vote', votesResponse.data);
            setVotesResponse(votesResponse.data);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [currentUser, actorId, URL, userIdData]);

  return { userIdData, votesResponse };
};

export default useVoteTimer;
