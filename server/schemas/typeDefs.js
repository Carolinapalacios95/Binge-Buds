const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
  _id: ID
  username: String!
  email: String!
  password: String
  movieCount: Int
  savedMovies: [Movie]
  bingebuds: [BingeBud]
}

type BingeBud {
  username: String!
  email: String!
  movie: String!
}

type Movie {
  movieId: String
  description: String
  title: String
  image: String
}

type Auth {
  token: ID!
  user: User
}

type MovieAPI {
  results: [MovieResult]
}

type MovieResult {
  id: String
  original_title: String
  overview: String
  poster_path: String
}

type Query {
  me: User
  searchMovie(query: String!): MovieAPI
}

input savedMovie {
  movieId: String
  description: String
  title: String
  image: String
}

type Mutation {
  addUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  saveMovie(input: savedMovie!): User
  removeMovie(movieId: String!): User
}
`;

module.exports = typeDefs;