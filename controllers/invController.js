const invModel = require("../models/inventory-model");
console.log("invModel imported with functions:", Object.keys(invModel)); // Debugging import validation

const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  console.log("Processing buildByClassificationId with req.params:", req.params); // Debug incoming request params
  try {
    const classification_id = req.params.classificationId; // Retrieve classification ID
    const data = await invModel.getInventoryByClassificationId(classification_id); // Query inventory items

    if (!data || data.length === 0) {
      console.log("No vehicles found for classification ID:", classification_id);
      req.flash("notice", "No vehicles found for this classification.");
      return res.status(404).redirect("/inv");
    }

    const grid = await utilities.buildClassificationGrid(data); // Build classification grid
    const nav = await utilities.getNav(); // Generate navigation dynamically
    const className = data[0].classification_name; // Extract classification name

    console.log("Successfully fetched inventory data for classification:", className);
    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error in buildByClassificationId:", error);
    next(error);
  }
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  console.log("Building inventory management view...");
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash("notice"),
    });
    console.log("Successfully rendered management view.");
  } catch (error) {
    console.error("Error in buildManagementView:", error);
    next(error);
  }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  console.log("Rendering add-classification view...");
  try {
    const nav = await utilities.getNav(); // Build navigation dynamically
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: req.flash("notice"),
    });
    console.log("Successfully rendered add-classification view.");
  } catch (error) {
    console.error("Error in buildAddClassificationView:", error);
    next(error);
  }
};

/* ***************************
 *  Process add classification form
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  console.log("Processing addClassification with req.body:", req.body); // Debugging form submission
  try {
    const { classificationName } = req.body; // Extract data from form submission
    const result = await invModel.addClassification(classificationName); // Call model function to insert data
    if (result.rowCount > 0) {
      req.flash("notice", `Successfully added classification: ${classificationName}`);
      res.redirect("/inv");
    } else {
      req.flash("notice", "Failed to add classification.");
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    console.error("Error in addClassification:", error);
    next(error);
  }
};

/* ***************************
 *  Export controller functions
 * ************************** */
module.exports = invCont;
