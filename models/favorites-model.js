const pool = require('../database/');

async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2) RETURNING *;
    `;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in addFavorite:", error);
    throw new Error("Unable to add favorite.");
  }
}

async function getFavorites(account_id) {
  try {
    const sql = `
      SELECT inventory.inv_id, inventory.inv_make
      FROM favorites
      JOIN inventory ON favorites.inv_id = inventory.inv_id
      WHERE favorites.account_id = $1;
    `;
    console.log("Account ID in getFavorites model:", account_id); // Debug account_id
    const result = await pool.query(sql, [account_id]); // Execute query
    console.log("Favorites Query Result:", result.rows); // Debug query result
    return result.rows;
  } catch (error) {
    console.error("Error in getFavorites:", error); // Log errors
    throw new Error("Unable to retrieve favorites.");
  }
}


async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE account_id = $1 AND inv_id = $2;
    `;
    await pool.query(sql, [account_id, inv_id]);
    return true;
  } catch (error) {
    console.error("Error in removeFavorite:", error);
    throw new Error("Unable to remove favorite.");
  }
}

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite
};
