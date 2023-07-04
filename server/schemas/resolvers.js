const { User } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require("../utils/auth");


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
          },
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
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedMovies: input } },
                { new: true}
              );
            };
              
              const otherUsers = await User.find({
                _id: { $ne: context.user._id},
                savedMovies: { movieId: input.movieId }
              });

              for (const user of otherUsers) {
                const notification = new Notification({
                  user: context.user._id,
                  email: context.user.email,
                  movie: input.movieId,
                  recipient: user._id,
                  // Add any other relevant notification data
                });
                await notification.save();
               
                // Emit real-time event to notify the recipient user
                // Example using Socket.IO
                io.emit(`notification:${user._id}`, notification);
              }
       
              return updatedUser;
            }
          },
          removeMovie: async (parent, { movieId }, context) => {
            if (context.user) {
              return User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedMovies: { movieId } } },
                { new: true }
              );
            }
            throw new AuthenticationError('You need to be logged in!');
          },
        };
    

module.exports = resolvers;