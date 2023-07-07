const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedMovies` array in User.js
const bingeBudSchema = new Schema({ 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
      },
})

module.exports = bingeBudSchema;
