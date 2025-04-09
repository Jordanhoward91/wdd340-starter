const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      return res.status(404).send("No vehicles found for this classification.")
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Get inventory item details
 * ************************** */
invCont.getInventoryDetail = async function (req, res, next) {
  try {
    const invId = req.params.inv_id
    const vehicle = await invModel.getVehicleById(invId)

    if (!vehicle) {
      return res.status(404).send("Vehicle not found")
    }

    res.render("inventory/detail", { vehicle })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash("notice"),
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: req.flash("notice"),
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process add classification form
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classificationName } = req.body
    const result = await invModel.addClassification(classificationName)

    if (result.rowCount > 0) {
      req.flash("notice", `Successfully added classification: ${classificationName}`)
      const nav = await utilities.getNav() // Update navigation
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash("notice"),
      })
    } else {
      req.flash("notice", "Failed to add classification")
      res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        messages: req.flash("notice"),
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav(); // Dynamic navigation bar
    const classificationList = await utilities.buildClassificationList(); // Generate dropdown
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList, // Pass the dropdown to the view
      invMake: "",
      invModel: "",
      invDescription: "",
      invImagePath: "/images/no-image.png",
      invThumbnailPath: "/images/no-image.png",
      invPrice: "",
      invMiles: "",
      invColor: "",
      messages: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
};


/* ***************************
 *  Process add inventory form
 * ************************** */
invCont.addInventoryItem = async function (req, res, next) {
  try {
    const {
      classification_id,
      invMake,
      invModel,
      invDescription,
      invImagePath,
      invThumbnailPath,
      invPrice,
      invMiles,
      invColor,
    } = req.body

    const result = await invModel.addInventoryItem(
      classification_id,
      invMake,
      invModel,
      invDescription,
      invImagePath,
      invThumbnailPath,
      invPrice,
      invMiles,
      invColor
    )

    if (result.rowCount > 0) {
      req.flash("notice", `Successfully added new inventory item: ${invMake} ${invModel}`)
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav: await utilities.getNav(),
        messages: req.flash("notice"),
      })
    } else {
      req.flash("notice", "Failed to add inventory item")
      res.status(500).render("inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav: await utilities.getNav(),
        classificationList: await utilities.buildClassificationList(classification_id),
        invMake,
        invModel,
        invDescription,
        invImagePath,
        invThumbnailPath,
        invPrice,
        invMiles,
        invColor,
        messages: req.flash("notice"),
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
