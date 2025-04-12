const utilities = require('../utilities');
const accountModel = require('../models/account-model'); // Import the account model
const jwt = require("jsonwebtoken");
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

// Keep existing functions...

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

async function processLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { email, password } = req.body; // Extract login data

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
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/");
    } else {
      req.flash("message notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden');
  }
}

// Export controller functions
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  processLogin,
  accountLogin,
  accountManagement, // Added this new function
};
