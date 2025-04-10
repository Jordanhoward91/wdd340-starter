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
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  console.log("Rendering add inventory view...");
  try {
    const nav = await utilities.getNav(); // Build navigation dynamically
    const classificationList = await utilities.buildClassificationList(); // Generate dropdown list
    
    // Debugging the dropdown content
    console.log("Generated classificationList HTML:", classificationList);

    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList, // Pass dropdown list to the view
      invMake: "",
      invModel: "",
      invDescription: "",
      invImagePath: "/images/no-image.png",
      invThumbnailPath: "/images/no-image.png",
      invPrice: "",
      invMiles: "",
      invColor: "",
      invYear: "",
      messages: req.flash("notice"),
    });
    console.log("Successfully rendered add inventory view.");
  } catch (error) {
    console.error("Error in buildAddInventoryView:", error);
    next(error);
  }
};


/* ***************************
 *  Process add inventory form
 * ************************** */
invCont.addInventoryItem = async function (req, res, next) {
  console.log("Processing addInventoryItem with req.body:", req.body); // Debug incoming request data
  try {
    const {
      classification_id,
      invMake,
      invModel: model,
      invDescription,
      invImagePath,
      invThumbnailPath,
      invPrice,
      invMiles,
      invColor,
      invYear, // Ensure invYear is destructured
    } = req.body;

    console.log("Calling invModel.addInventoryItem...");
    const result = await invModel.addInventoryItem(
      classification_id,
      invMake,
      model,
      invDescription,
      invImagePath,
      invThumbnailPath,
      invPrice,
      invMiles,
      invColor,
      invYear // Ensure invYear is passed to the model
    );
    console.log("addInventoryItem result:", result);

    if (result.rowCount > 0) {
      req.flash("notice", `Successfully added new inventory item: ${invMake} ${model}`);
      res.status(201).redirect("/inv"); // Redirect to inventory management
    } else {
      req.flash("notice", "Failed to add inventory item");
      res.status(500).render("inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav: await utilities.getNav(),
        classificationList: await utilities.buildClassificationList(classification_id),
        invMake,
        invModel: model,
        invDescription,
        invImagePath,
        invThumbnailPath,
        invPrice,
        invMiles,
        invColor,
        invYear,
        messages: req.flash("notice"),
      });
    }
  } catch (error) {
    console.error("Error in addInventoryItem controller:", error);
    next(error);
  }
};

/* ***************************
 *  Get inventory item details
 * ************************** */
invCont.getInventoryDetail = async function (req, res, next) {
  console.log("Processing getInventoryDetail for inv_id:", req.params.inv_id); // Debug incoming ID
  try {
    const invId = req.params.inv_id;
    const vehicle = await invModel.getVehicleById(invId);

    if (!vehicle) {
      console.log("No vehicle found for inv_id:", invId);
      req.flash("notice", "Vehicle not found.");
      return res.status(404).redirect("/inv");
    }

    res.render("inventory/detail", { vehicle });
  } catch (error) {
    console.error("Error in getInventoryDetail:", error);
    next(error);
  }
};

/* ***************************
 *  Deliver delete confirmation view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  console.log("Building delete confirmation view for inv_id:", req.params.inv_id);
  try {
    const inv_id = parseInt(req.params.inv_id);
    const nav = await utilities.getNav();
    const inv = await invModel.getVehicleById(inv_id); // Fetch vehicle details

    if (!inv) {
      console.log("Vehicle not found for inv_id:", inv_id);
      req.flash("notice", "Vehicle not found.");
      return res.redirect("/inv");
    }

    const name = `${inv.make} ${inv.model}`;
    res.render("inventory/delete-confirm", {
      title: `Delete ${name}`,
      nav,
      inv,
      messages: req.flash("notice"),
    });
    console.log("Successfully rendered delete confirmation view for:", name);
  } catch (error) {
    console.error("Error in buildDeleteView:", error);
    next(error);
  }
};

/* ***************************
 *  Process delete inventory item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  console.log("Processing delete request for inv_id:", req.body.inv_id);
  try {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInventoryItem(inv_id);

    if (deleteResult.rowCount > 0) {
      req.flash("notice", "The inventory item was successfully deleted.");
      res.redirect("/inv"); // Redirect to inventory management
    } else {
      req.flash("notice", "Failed to delete the inventory item.");
      res.redirect(`/inv/delete/${inv_id}`); // Redirect back to confirmation
    }
  } catch (error) {
    console.error("Error in deleteInventoryItem controller:", error);
    next(error);
  }
};

module.exports = invCont;
