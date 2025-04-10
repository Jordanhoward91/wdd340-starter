// Import required external resources
const express = require('express');
const router = express.Router();
const utilities = require('../utilities'); // Adjust path as needed
const accountsController = require('../controllers/accountsController'); // Ensure this path is correct

// Define the "My Account" GET route
router.get('/my-account', utilities.handleErrors(accountsController.buildLogin));

// Route to build login view
router.get('/login', utilities.handleErrors(accountsController.buildLogin));

// Route to build registration view
router.get('/register', utilities.handleErrors(accountsController.buildRegister));

// Route to handle registration form submission
router.post('/register', utilities.handleErrors(accountsController.registerAccount));

// Route to handle login form submission
router.post('/login', utilities.handleErrors(accountsController.processLogin));

// Export the router for use in other files
module.exports = router;
