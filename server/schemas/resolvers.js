const { User } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require("../utils/auth");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
const apiKey= process.env.API_KEY;
console.log("API KEY", apiKey);

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
          },
          searchMovie: async (parent, { query }) => {
            const params = query ? { query } : {};
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`);
            const movies = await response.json();
            console.log("MOVIES", movies);
            return movies;
          }
        },
        Mutation: {
          addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
          saveMovie: async (parent, { input }, context) => {
            if (context.user) {
              return User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedMovies: input } },
                { new: true}
              );
            }
            throw new AuthenticationError('You need to be logged in!');
          },
          removeMovie: async (parent, { movieId }, context) => {
            if (context.user) {
              return User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedMovies: { movieId: movieId }} },
                { new: true}
              );
            }
            throw new AuthenticationError('You need to be logged in!');
          },
        },
      };

module.exports = resolvers;