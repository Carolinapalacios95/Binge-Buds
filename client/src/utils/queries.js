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