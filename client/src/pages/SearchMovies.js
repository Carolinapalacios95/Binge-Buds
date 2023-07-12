import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import SearchList from "../components/SearchList";
import Auth from '../utils/auth';
import { useMutation, useLazyQuery } from '@apollo/client';
import { SAVE_MOVIE } from '../utils/mutations';
import { SEARCH_MOVIE } from '../utils/queries';
import { saveMovieIds, getSavedMovieIds } from '../utils/localStorage';

const SearchMovies = () => {
  // create state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');



  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [searchMovie, { loading, data: searchMovieData }] = useLazyQuery(SEARCH_MOVIE, {
    variables: { query: searchInput }
  });
  // const searchMovieResults = useQuery(SEARCH_MOVIE);

  const [saveMovie, { error, data: saveMovieData }] = useMutation(SAVE_MOVIE);
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
      searchMovie({
        variables: { query: searchInput }
      });
      if (searchMovieData) {
        setSearchedMovies(searchMovieData.movies || []);
      }
    }
    catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (searchMovieData) {
      console.log("SEARCH RESPONSE", searchMovieData);
    }
  }, [searchMovieData]);

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
      const { saveMovieData } = await saveMovie({
        variables: { input: movieToSave, token }
      });

      // if movie successfully saves to user's account, save movie id to state
      setSavedMovieIds(saveMovieData.saveMovie.savedMovies.map(x => x.movieId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <br></br>
      <div className="color-search">
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
                <Button type='submit' className="color-searchbutton" variant='success' size='lg'>
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
            : ''}
        </h2>

        <SearchList
          searchMovieData={searchMovieData}
        >
        </SearchList>
      </Container>

      <container>
        <Card>

        </Card>
      </container>
    </>
  );
};

export default SearchMovies;
