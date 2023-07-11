import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      movieCount
      savedMovies {
        movieId
        description
        title
        image
      }
    }
  }
`;

export const SEARCH_MOVIE = gql`
  query searchMovie($query: String!) {
    searchMovie(query: $query) {
      results {
        id
        original_title
        overview
        poster_path
      }
    }
  }
`;

