const favoritesModel = require('../models/favorites-model');

async function addFavorite(req, res, next) {
  try {
    const { item_id } = req.body;
    const account_id = req.user.account_id; // Extract account_id from JWT
    const result = await favoritesModel.addFavorite(account_id, item_id);
    req.flash("notice", "Item added to favorites!");
    res.redirect("/account/management");
  } catch (error) {
    console.error("Error in addFavorite:", error);
    req.flash("notice", "Unable to add favorite. Please try again.");
    res.redirect("/account/management");
  }
}

async function getFavorites(req, res, next) {
  try {
    const account_id = req.user.account_id; // Extract account_id from JWT
    const favorites = await favoritesModel.getFavorites(account_id);
    res.render("account/favorites", {
      title: "My Favorites",
      nav: req.nav,
      favorites,
      flash: req.flash()
    });
  } catch (error) {
    console.error("Error in getFavorites:", error);
    next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const { item_id } = req.body;
    const account_id = req.user.account_id; // Extract account_id from JWT
    await favoritesModel.removeFavorite(account_id, item_id);
    req.flash("notice", "Item removed from favorites!");
    res.redirect("/account/management");
  } catch (error) {
    console.error("Error in removeFavorite:", error);
    req.flash("notice", "Unable to remove favorite. Please try again.");
    res.redirect("/account/management");
  }
}

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite
};
