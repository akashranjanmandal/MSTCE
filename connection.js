const db = require('mongoose');

// MongoDB connection URI
const uri = 'mongodb+srv://souvikghoshtal:timesheettal@timesheet.gmyjc9b.mongodb.net/ERP';

// Connect to MongoDB cluster
db.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  });

// Export the Mongoose connection instance
module.exports = db
