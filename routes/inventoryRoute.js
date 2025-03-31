// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display inventory item details
router.get('/inventory/:inv_id', invController.getInventoryDetail);

// Intentional error route for testing middleware
router.get('/error-test', (req, res, next) => {
  next(new Error("Intentional server error"));
});

module.exports = router;