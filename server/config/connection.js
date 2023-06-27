const mongoose = require('mongoose');
// Replace 'project 3' with name of project
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/project3');

module.exports = mongoose.connection;