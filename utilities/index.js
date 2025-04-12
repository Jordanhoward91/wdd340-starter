const invModel = require("../models/inventory-model"); // Import inventory model
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {};

/* ************************
 * Constructs the navigation HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications(); // Fetch classifications from the database
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error in getNav:", error); // Log any errors in navigation creation
    throw error;
  }
};

/* **************************************
 * Build the classification view grid HTML
 ************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = ""; // Initialize grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ******************************
 * Build the classification dropdown list
 ****************************** */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    const data = await invModel.getClassifications(); // Fetch all classifications
    console.log("Fetched classifications from DB:", data.rows); // Debug fetched data

    const uniqueClassifications = data.rows.reduce((acc, current) => {
      if (!acc.some((item) => item.classification_id === current.classification_id)) {
        acc.push(current);
      }
      return acc;
    }, []);

    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    uniqueClassifications.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      if (classification_id && row.classification_id == classification_id) {
        classificationList += " selected";
      }
      classificationList += `>${row.classification_name}</option>`;
    });
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("Error in buildClassificationList:", error); // Log errors for debugging
    throw error;
  }
};

/* ******************************
 * Handle errors in asynchronous route handlers
 ****************************** */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}



/* ******************************
 * Export utilities
 ****************************** */
module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildClassificationList: Util.buildClassificationList,
  handleErrors, // Exported error-handling utility
  checkJWTToken: Util.checkJWTToken,
};
