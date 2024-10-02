const mongoose = require('mongoose');

// Retrieve the DB_CONNECTION variable from the environment
const dbConnString = process.env.DB_CONNECTION;

// Connect to the MongoDB database using mongoose
mongoose.connect(dbConnString, {
  useNewUrlParser: true,
  useUnifiedTopology:true
});

// Check if the connection was successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to the database');
});
