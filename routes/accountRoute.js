// Import required external resources
const express = require('express');
const router = express.Router();
const utilities = require('../utilities'); // Adjust path as needed
const accountsController = require('../controllers/accountsController'); // Ensure this path is correct
const regValidate = require('../validation/regValidate'); // Assuming this path is correct

// Default account route
router.get('/', utilities.handleErrors(accountsController.accountManagement));

// Define the "My Account" GET route
router.get('/my-account', utilities.handleErrors(accountsController.buildLogin));

// Route to build login view
router.get('/login', utilities.handleErrors(accountsController.buildLogin));

// Route to build registration view
router.get('/register', utilities.handleErrors(accountsController.buildRegister));

// Route to handle registration form submission
router.post('/register', utilities.handleErrors(accountsController.registerAccount));

// Process the login request
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountsController.accountLogin)
);

// Export the router for use in other files
module.exports = router;
