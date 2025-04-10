const pool = require('../database/'); // Import the database connection pool

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *;
    `;
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    console.log("Account registered successfully:", result.rows[0]); // Debugging the registered account
    return result.rows[0];
  } catch (error) {
    console.error("Error in registerAccount:", error); // Debugging
    throw new Error("Registration failed. Please try again."); // Return a generic error message for external handling
  }
}

/* *****************************
 *   Verify login credentials
 * *************************** */
async function verifyCredentials(email, password) {
  try {
    const sql = `
      SELECT account_firstname AS "firstName", account_lastname AS "lastName", account_email AS "email"
      FROM account
      WHERE account_email = $1 AND account_password = $2;
    `;
    const result = await pool.query(sql, [email, password]);
    console.log("Verify credentials result:", result.rows[0]); // Debugging login result
    return result.rows[0]; // Return the user with aliased properties (null if no match)
  } catch (error) {
    console.error("Error in verifyCredentials:", error); // Debugging
    throw new Error("Login failed. Please check your credentials.");
  }
}

module.exports = {
  registerAccount, // Export the register function
  verifyCredentials, // Export the login verification function
};
