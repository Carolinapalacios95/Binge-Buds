const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
  _id: ID
  username: String!
  email: String!
  password: String
  movieCount: Int
  savedMovies: [Movie]
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

type Query {
  me: User
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
  removeMovie(bookId: String!): User
}
`;

module.exports = typeDefs;