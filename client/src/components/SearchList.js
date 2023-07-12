import { React, useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_MOVIE } from '../utils/mutations';
import {
    Row,
    Col,
    Button,
    Card,
} from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveMovieIds, getSavedMovieIds } from '../utils/localStorage';

const SearchList = ( {searchMovieData} ) => {
    console.log("Search Movie", searchMovieData);
    const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

    const [saveMovie, { error, data: saveMovieData }] = useMutation(SAVE_MOVIE);
    const handleSaveMovie = async (movieId) => {
        // find the movie in `searchedMovies` state by the matching id
        const movieToSave = searchMovieData.searchMovie.results.find((movie) => movie.id === movieId);
        
        // get token
        const token = Auth.loggedIn() ? Auth.getToken() : null;
    
        if (!token) {
          return false;
        }
    
        try {
          const { data:saveMovieData } = await saveMovie({
            variables: { input: {
                movieId: movieToSave.id,
                description: movieToSave.overview,
                title: movieToSave.original_title,
                image: movieToSave.poster_path,
              }, token }
          });
          console.log("save movie data", saveMovieData)
          // if movie successfully saves to user's account, save movie id to state
          setSavedMovieIds(saveMovieData.saveMovie.savedMovies.map(x => x.movieId));
        } catch (err) {
          console.error(err);
        }
      };

    if(searchMovieData?.searchMovie.results && searchMovieData.searchMovie.results.length > 0){
        return(
            <Row>
            {searchMovieData.searchMovie.results.map((movie) => {
              return (
                <Col md="4">
                  <Card key={movie.id} border='dark'>
                    {movie.poster_path ? (
                      <Card.Img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`The cover for ${movie.original_title}`} variant='top' />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{movie.original_title}</Card.Title>
                      <p className='small'>Overview: </p>
                      <Card.Text>{movie.overview}</Card.Text>
                      {Auth.loggedIn() && (
                        <Button
                          disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movie.id)}
                          className='btn-block btn-info'
                          onClick={() => handleSaveMovie(movie.id)}>
                          {savedMovieIds?.some((savedMovieId) => savedMovieId === movie.id)
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
        )
    } else {
        return <div>no results</div>
    }
}
export default SearchList;