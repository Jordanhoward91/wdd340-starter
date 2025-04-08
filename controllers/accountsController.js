const utilities = require('../utilities'); // Adjust path if necessary

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

module.exports = { buildLogin, buildRegister };

