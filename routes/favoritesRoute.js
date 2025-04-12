const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const utilities = require('../utilities');

// Route to get the favorites view
router.get('/', utilities.checkJWTToken, favoritesController.getFavorites);

// Route to add an item to favorites
router.post('/add', utilities.checkJWTToken, favoritesController.addFavorite);

// Route to remove an item from favorites
router.post('/remove', utilities.checkJWTToken, favoritesController.removeFavorite);

module.exports = router;
