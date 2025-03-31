const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      return res.status(404).send("No vehicles found for this classification.");
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Get inventory item details
 * ************************** */
invCont.getInventoryDetail = async function (req, res, next) {
  try {
    const invId = req.params.inv_id;
    const vehicle = await invModel.getVehicleById(invId);

    if (!vehicle) {
      return res.status(404).send("Vehicle not found");
    }

    res.render("inventory/detail", { vehicle });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
