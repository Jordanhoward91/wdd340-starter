const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

console.log("invController functions:", Object.keys(invController)); // Debugging to verify functions

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to display inventory item details
router.get('/inventory/:inv_id', utilities.handleErrors(invController.getInventoryDetail));

// Route to display the management view
router.get('/', utilities.handleErrors(invController.buildManagementView));

// Route to display the add classification form
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassificationView));

// Route to process the add classification form
router.post('/add-classification', utilities.handleErrors(invController.addClassification));

// Route to display the add inventory form
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventoryView));

// Route to process the add inventory form
router.post('/add-inventory', utilities.handleErrors(invController.addInventoryItem));

// Route to display delete confirmation view
router.get('/delete/:inv_id', utilities.handleErrors(invController.buildDeleteView));

// Route to process delete confirmation form
router.post('/delete', utilities.handleErrors(invController.deleteInventoryItem));

// Intentional error route for testing middleware
router.get('/error-test', (req, res, next) => {
  next(new Error("Intentional server error"));
});

module.exports = router;
