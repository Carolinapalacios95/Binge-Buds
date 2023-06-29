const { User } = require("../models");

const resolvers = {
    Query: {
        //get all users
        User: async () => {
            return User.find();
        },
        //get user by id
        User: async (parent, { userId }) => {
            return User.findOne({ _id: userId });
        },
        //get all movies
        Movie: async () => {
            return Movie.find();
        },
        //get movie by id
        Movie: async (parent, { userId }) => {
            return Movie.findOne({ _id: userId });
        },

        Mutation: {
            //addUser mutation
            addUser: async (parent, { name }) => {
              return User.create({ name });
            },
            //addMovie(To User) mutation
            addMovie: async (parent, { userId, Movie }) => {
              return User.findOneAndUpdate(
                { _id: userId },
                {
                  $addToSet: { savedMovies: Movie },
                },
                {
                  new: true,
                  runValidators: true,
                }
              );
            },
            //removeMovie(From user) mutation
            removeMovie: async (parent, { userId, Movie }) => {
              return Profile.findOneAndUpdate(
                { _id: profileId },
                { $pull: { savedMovies: Movie } },
                { new: true }
              );
            },
          },
        },
    }


