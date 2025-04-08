// Require the utilities module
const utilities = require('../utilities'); // Adjust the path if necessary

// ****************************************
//  Deliver login view
// ****************************************
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav(); // Fetch navigation bar content
  res.render("account/login", { // Render the login view
    title: "Login",
    nav,
  });
}

module.exports = { buildLogin };
