const utilities = require('../utilities');
const accountModel = require('../models/account-model'); // Import the account model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Required for password hashing
require("dotenv").config();

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function accountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav(); // Generate navigation dynamically
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      flash: req.flash(), // Display any flash messages
    });
  } catch (error) {
    console.error("Error in accountManagement:", error); // Debugging error
    next(error);
  }
}

/* ****************************************
 *  Build Login View
 * ************************************ */
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

/* ****************************************
 *  Build Register View
 * ************************************ */
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

/* ****************************************
 *  Register New Account
 * ************************************ */
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { firstName, lastName, email, password } = req.body; // Extract form data

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

/* ****************************************
 *  Process Login
 * ************************************ */
async function processLogin(req, res, next) {
  try {
    console.log("Request Body:", req.body); // Log the submitted form data

    const nav = await utilities.getNav();
    const { email, password } = req.body; // Extract login data

    const user = await accountModel.verifyCredentials(email, password);
    console.log("User Data:", user); // Debugging output

    if (user) {
      // Include account_id and other necessary fields in the JWT payload
      const payload = {
        account_id: user.account_id, // Ensure account_id is included
        firstName: user.firstName,
        account_type: user.account_type, // Add any other fields as needed
      };
      console.log("JWT Payload (processLogin):", payload); // Debugging payload

      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3600000 });
      req.flash("notice", `Welcome back, ${user.firstName}!`);
      res.redirect("/");
    } else {
      req.flash("notice", "Login failed. Invalid credentials.");
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash("notice"),
      });
    }
  } catch (error) {
    console.error("Error in processLogin:", error); // Log any unexpected errors
    next(error);
  }
}

/* ****************************************
 *  Account Login (Alternative Implementation)
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;

      // Include account_id and other necessary fields in the JWT payload
      const payload = {
        account_id: accountData.account_id, // Ensure account_id is included
        firstName: accountData.firstName,
        account_type: accountData.account_type, // Add any other fields as needed
      };
      console.log("JWT Payload (accountLogin):", payload); // Debugging payload

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 });
      res.redirect("/"); // Redirect to home page
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Error in accountLogin:", error);
    next(error);
  }
}

// Export controller functions
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  processLogin,
  accountLogin,
  accountManagement,
};
