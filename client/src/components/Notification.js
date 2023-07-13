import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';

const BingeBudNote = () => {
  const { loading, error, data } = useQuery(GET_ME);
  const [showNotification, setShowNotification] = useState(true);
  const [lastSavedMovie, setLastSavedMovie] = useState('');

  useEffect(() => {
    if (!loading && data) {
      const savedMovies = data?.me?.savedMovies || [];
      if (savedMovies.length > 0) {
        const latestSavedMovie = savedMovies[savedMovies.length - 1];
        if (latestSavedMovie.title !== lastSavedMovie) {
          setShowNotification(true);
          setLastSavedMovie(latestSavedMovie.title);
        }
      }
    }
  }, [loading, data, lastSavedMovie]);

  const bingebuds = data?.me?.bingebuds || [];
  const potentialBingebud = bingebuds[0]; // Get the first potential bingebud

  console.log('bingebuds:', bingebuds);
  console.log('potentialBingebud:', potentialBingebud);

  const hasBingebud = bingebuds.length > 0;

  console.log('hasBingebud:', hasBingebud);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  console.log('showNotification:', showNotification);

  return (
    <div>
      {/* Existing component JSX */}
      {hasBingebud && showNotification && (
        <div className="notification-box">
          <button className="close-button" onClick={handleCloseNotification}>
            X
          </button>
          <h3>You've got a BingeBud for {potentialBingebud.movie}!:</h3>
          <p>Username: {potentialBingebud.username}</p>
          <p>Email: {potentialBingebud.email}</p>
          <h3>Reach out to schedule a movie date!</h3>
          {/* Additional contact info or details */}
        </div>
      )}
    </div>
  );
};

export default BingeBudNote;