const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an express app
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB (no need for deprecated options anymore)
mongoose.connect('mongodb://localhost:27017/simpledb')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// Define a simple schema and model for MongoDB
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
  });
  

const User = mongoose.model('User', userSchema);

app.post('/add-user', async (req, res) => {
    try {
      const { name, email } = req.body;
  
      // Create a new user instance with the data
      const user = new User({
        name: name,
        email: email
      });
  
      // Save the user to MongoDB
      await user.save();
  
      res.status(201).send('User added successfully');
    } catch (error) {
      res.status(500).send('Error adding user: ' + error.message);
    }
  });
  

// Define a GET route to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from MongoDB
    res.status(200).json(users);      // Send users as JSON
  } catch (error) {
    res.status(500).send('Error fetching users: ' + error.message);
  }
});
app.get('/search-users', async (req, res) => {
  const searchTerm = req.query.name || '';  // Get the name query parameter or default to an empty string
  try {
    const users = await User.find({
      name: { $regex: searchTerm, $options: 'i' }  // Perform a case-insensitive search
    });
    res.status(200).json(users);  // Send users as JSON
  } catch (error) {
    res.status(500).send('Error fetching users: ' + error.message);
  }
});


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
