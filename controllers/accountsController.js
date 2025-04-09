const utilities = require('../utilities');
const accountModel = require('../models/account-model'); // Import the account model

// ****************************************
//  Deliver login view
// ****************************************
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    messages: null, // Default flash message
  });
}

// ****************************************
//  Deliver registration view
// ****************************************
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null, // Placeholder for future error handling
  });
}

// ****************************************
//  Process Registration
// ****************************************
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { firstName, lastName, email, password } = req.body;

  // Call the model function to register a new account
  const regResult = await accountModel.registerAccount(firstName, lastName, email, password);

  if (regResult.rowCount > 0) {
    req.flash(
      'notice',
      `Congratulations, you're registered ${firstName}. Please log in.`
    );
    res.status(201).render('account/login', {
      title: 'Login',
      nav,
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/register', {
      title: 'Register',
      nav,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount };
