import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { SAVE_MOVIE } from '../utils/mutations';
import { searchMoviesApi } from '../utils/API';
import { saveMovieIds, getSavedMovieIds } from '../utils/localStorage';

const SearchMovies = () => {
  // create state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, {error, data}] = useMutation(SAVE_MOVIE);
  // set up useEffect hook to save `savedMovieIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  });

  // create method to search for movies and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchMoviesApi(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const items  = await response.json();
      console.log(items.results)
      

      const movieData = items.results.map((movie) => ({
        movieId: movie.id.toString(),
        title: movie.original_title,
        description: movie.overview,
        image: movie.poster_path || '',
      }));

      setSearchedMovies(movieData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a movie to our database
  const handleSaveMovie = async (movieId) => {
    // find the movie in `searchedMovies` state by the matching id
    const movieToSave = searchedMovies.find((movie) => movie.movieId === movieId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveMovie({
        variables: { input: movieToSave, token}
      });

      // if movie successfully saves to user's account, save movie id to state
      setSavedMovieIds(data.saveMovie.savedMovies.map(x => x.movieId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className='text-light bg-dark pt-5'>
        <Container>
          <h1>Search for Movies!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a movie'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : 'Search for a movie to begin'}
        </h2>
        <Row>
          {searchedMovies.map((movie) => {
            return (
              <Col md="4">
                <Card key={movie.movieId} border='dark'>
                  {movie.image ? (
                    <Card.Img src={`https://image.tmdb.org/t/p/original${movie.image}`} alt={`The cover for ${movie.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <p className='small'>Overview: </p>
                    <Card.Text>{movie.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveMovie(movie.movieId)}>
                        {savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)
                          ? 'This movie has already been saved!'
                          : 'Save this Movie!'}
                      </Button>
                    )}
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

export default SearchMovies;
