import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { REMOVE_MOVIE } from '../utils/mutations';
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeMovieId } from '../utils/localStorage';
import { useLazyQuery, useMutation } from '@apollo/client';

const SavedMovies = () => {
  const [userData, setUserData] = useState({});
  const [getMe] = useLazyQuery(GET_ME);

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  const [deleteMovie, {error, data}] = useMutation(REMOVE_MOVIE);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const { data } = await getMe({variables: {token}});

        setUserData(data.me);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength, getMe]);

  // create function that accepts the movie's mongo _id value as param and deletes the movie from the database
  const handleDeleteMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {

      const { data } = await deleteMovie({
        variables: { movieId, token}
      });


      console.log({data})
      setUserData(data.removeMovie);
      // upon success, remove movie's id from localStorage
      removeMovieId(movieId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved movies!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedMovies.length
            ? `Viewing ${userData.savedMovies.length} saved ${userData.savedMovies.length === 1 ? 'movie' : 'movies'}:`
            : 'You have no saved movies!'}
        </h2>
        <Row>
          {userData.savedMovies.map((movie) => {
            return (
              <Col md="4">
                <Card key={movie.movieId} border='dark'>
                  {movie.image ? <Card.Img src={`https://image.tmdb.org/t/p/original${movie.image}`} alt={`The cover for ${movie.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <p className='small'>Overview:</p>
                    <Card.Text>{movie.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteMovie(movie.movieId)}>
                      Delete this Movie!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedMovies;
