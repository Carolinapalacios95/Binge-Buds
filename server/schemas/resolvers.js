const { User } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require("../utils/auth");
const AuthService = require("../utils/auth");

const resolvers = {
    Query: {
        //get all users
        getUser: async () => {
            return User.find();
        },
        //get user by id
        getUserbyId: async ({ userId }) => {
            return User.findOne({ _id: userId });
        },
        //get all movies
        getMovie: async () => {
            return Movie.find();
        },
        //get movie by id
        getMoviebyId: async ({ userId }) => {
            return Movie.findOne({ _id: userId });
        },

        Mutation: {
            //addUser mutation
            addUser: async ({ name }) => {
                return User.create({ name });
            },
            //addMovie(To User) mutation
            addMovie: async ({ userId, Movie }) => {
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
            removeMovie: async ({ userId, Movie }) => {
                return User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { savedMovies: Movie } },
                    { new: true }
                );
            },
            login: async ({ email, password }) => {
                const user = await User.findOne({ email });

                if (!user) {
                    throw new AuthenticationError('No profile with this email found!');
                }

                const correctPw = await user.isCorrectPassword(password);

                if (!correctPw) {
                    throw new AuthenticationError('Incorrect password!');
                }

                const token = signToken(profile);
                return { token, profile };
            },
        },
    },
}

module.exports = resolvers;