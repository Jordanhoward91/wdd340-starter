// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to display inventory item details
router.get('/inventory/:inv_id', invController.getInventoryDetail)

// Route to display the management view
router.get('/', utilities.handleErrors(invController.buildManagementView))

// Route to display the add classification form
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassificationView))

// Route to process the add classification form
router.post('/add-classification', utilities.handleErrors(invController.addClassification))

// Route to display the add inventory form
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventoryView))

// Route to process the add inventory form
router.post('/add-inventory', utilities.handleErrors(invController.addInventoryItem))

// Intentional error route for testing middleware
router.get('/error-test', (req, res, next) => {
  next(new Error("Intentional server error"))
})

module.exports = router
