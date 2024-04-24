const mongoose = require('mongoose');

// Define the schema for the user data
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  contactNo: String,
  email: String,
  dob: Date,
  password: String,
  fatherName: String,
  motherName: String,
  guardianName: String,
  guardianContactNo: String,
  addressLine1: String,
  addressLine2: String,
  boardName: [String],
  schoolName: [String],
  percentage:[ Number],
  passoutYear: [Date],
  status: {type: String ,
    default: "Rejected"}
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);


const paymentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  status: {
    type: String,
  },
  // You can add more fields as needed
}, { timestamps: true });

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {User, Payment};
