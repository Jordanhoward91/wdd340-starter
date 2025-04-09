// Import required external resources
const express = require('express');
const router = express.Router();
const utilities = require('../utilities'); // Adjust path as needed
const accountsController = require('../controllers/accountsController'); // Ensure this path is correct

// Define the "My Account" GET route
router.get('/my-account', 
  accountsController.buildLogin, // Correct function name from the accounts controller
  (err, req, res, next) => { // Error handling middleware
    console.error(err.message);
    res.status(500).send('Something went wrong. Please try again later.');
  }
);

// Route to build login view
router.get('/login', utilities.handleErrors(accountsController.buildLogin));

// Route to build registration view
router.get('/register', utilities.handleErrors(accountsController.buildRegister));

// Route to handle registration form submission
router.post('/register', utilities.handleErrors(accountsController.registerAccount));

// Export the router for use in other files
module.exports = router;
