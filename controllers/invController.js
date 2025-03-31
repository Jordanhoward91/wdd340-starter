const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const inventoryModel = require('../models/inventory-model');

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

exports.getInventoryDetail = async (req, res, next) => {
  try {
    const invId = req.params.inv_id;
    const vehicle = await inventoryModel.getVehicleById(invId);

    if (!vehicle) {
      return res.status(404).send('Vehicle not found');
    }

    res.render('inventory/detail', { vehicle });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont