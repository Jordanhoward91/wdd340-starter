const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT DISTINCT classification_id, classification_name FROM public.classification ORDER BY classification_name");
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
    throw error; // Added throw to propagate error
  }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getVehicleById(invId) {
  try {
    const result = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1',
      [invId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database Error: ", error);
    throw error;
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classificationName) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classificationName]); // Logging added
    console.log("addClassification result:", result);
    return result;
  } catch (error) {
    console.error("addClassification error: " + error);
    throw error;
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventoryItem(
  classification_id,
  invMake,
  invModel,
  invDescription,
  invImagePath,
  invThumbnailPath,
  invPrice,
  invMiles,
  invColor,
  invYear // Included invYear here
) {
  console.log("addInventoryItem called with params:", {
    classification_id,
    invMake,
    invModel,
    invDescription,
    invImagePath,
    invThumbnailPath,
    invPrice,
    invMiles,
    invColor,
    invYear, // Logging invYear
  });
  try {
    const sql = `
      INSERT INTO public.inventory 
      (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_year) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `;
    const result = await pool.query(sql, [
      classification_id, // Ensure classification_id is passed
      invMake,
      invModel,
      invDescription,
      invImagePath,
      invThumbnailPath,
      invPrice,
      invMiles,
      invColor,
      invYear,
    ]);
    console.log("Query result:", result);
    return result;
  } catch (error) {
    console.error("addInventoryItem error: " + error);
    throw error; // Throw error to ensure proper debugging
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM public.inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    console.log("Delete result:", data); // Logging added for debugging
    return data;
  } catch (error) {
    console.error('Delete Inventory Error:', error);
    throw error;
  }
}

/* ***************************
 *  Export functions
 * ************************** */
console.log("Exporting addInventoryItem:", typeof addInventoryItem); // Debug export
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventoryItem,
  deleteInventoryItem,
};
