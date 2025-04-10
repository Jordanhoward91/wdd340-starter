const utilities = require('../utilities');
const accountModel = require('../models/account-model'); // Import the account model

// ****************************************
//  Deliver login view
// ****************************************
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav(); // Generate navigation dynamically
    res.render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice"), // Flash messages for user feedback
    });
  } catch (error) {
    console.error("Error in buildLogin:", error); // Debugging error
    next(error);
  }
}

// ****************************************
//  Deliver registration view
// ****************************************
async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav(); // Generate navigation dynamically
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null, // Placeholder for validation errors
    });
  } catch (error) {
    console.error("Error in buildRegister:", error); // Debugging error
    next(error);
  }
}

// ****************************************
//  Process Registration
// ****************************************
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { firstName, lastName, email, password } = req.body; // Extract form data

    // Call the model function to register the account
    const regResult = await accountModel.registerAccount(firstName, lastName, email, password);
    console.log("Registration result:", regResult); // Debugging registration output

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, ${firstName}, your account has been successfully registered. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash("notice"), // Success message
      });
    } else {
      req.flash("notice", "Registration failed. Please try again.");
      res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: req.flash("notice"), // Error feedback
      });
    }
  } catch (error) {
    console.error("Error in registerAccount:", error); // Debugging error
    next(error);
  }
}

// ****************************************
//  Process Login
// ****************************************
async function processLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { email, password } = req.body; // Extract login data

    // Verify login credentials via the model
    const user = await accountModel.verifyCredentials(email, password);
    console.log("User data:", user); // Debugging output

    if (user) {
      req.flash("notice", `Welcome back, ${user.firstName}!`);
      res.redirect("/inv"); // Redirect to inventory management
    } else {
      req.flash("notice", "Login failed. Invalid credentials.");
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash("notice"), // Feedback for failed login
      });
    }
  } catch (error) {
    console.error("Error in processLogin:", error); // Debugging error
    next(error);
  }
}

// ****************************************
//  Build dashboard view (optional functionality)
// ****************************************
async function buildDashboard(req, res, next) {
  try {
    const nav = await utilities.getNav(); // Generate navigation dynamically
    const user = req.user; // Middleware should populate `req.user` for logged-in users
    res.render("dashboard", {
      title: `Welcome, ${user.firstName}`, // Use user data for personalized welcome
      nav,
      user, // Pass user data to the view
    });
  } catch (error) {
    console.error("Error in buildDashboard:", error); // Debugging error
    next(error);
  }
}

// Export controller functions
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  processLogin,
  buildDashboard,
};
