const utilities = require('../utilities'); // Required module for utilities

// ****************************************
//  Deliver login view
// ****************************************
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  let messages = req.flash('info'); // Fetch flash messages (if using connect-flash)
  res.render("account/login", {
    title: "Login",
    nav,
    messages, // Ensure messages is passed as an array
  });
}


module.exports = { buildLogin };
