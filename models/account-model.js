const pool = require('../database/'); // Import the database connection pool
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported for password hashing

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10); // Hash the password
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *;
    `;
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword]);
    console.log("Account registered successfully:", result.rows[0]); // Debugging
    return result.rows[0];
  } catch (error) {
    console.error("Error in registerAccount:", error); // Log the error
    throw new Error("Registration failed. Please try again.");
  }
}

/* *****************************
 *   Verify login credentials
 * *************************** */
async function verifyCredentials(email, password) {
  try {
    const sql = `
      SELECT account_firstname AS "firstName", account_lastname AS "lastName", account_email AS "email", account_password
      FROM account
      WHERE account_email = $1;
    `;

    // Debug the input email
    console.log("Attempting to verify credentials for email:", email);

    const result = await pool.query(sql, [email]);
    const user = result.rows[0];
    console.log("Query Result:", user); // Debug query result

    if (!user) {
      console.log("No user found with email:", email); // Log missing user
      return null; // Email not found
    }

    // Compare the submitted password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.account_password);
    console.log("Password Match:", passwordMatch); // Debug the password comparison

    if (passwordMatch) {
      return user; // Valid credentials
    }

    console.log("Invalid password provided for email:", email); // Log invalid password
    return null; // Invalid password
  } catch (error) {
    console.error("Error in verifyCredentials:", error); // Log the error
    throw new Error("Login failed."); // Bubble up a generic error
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
      FROM account
      WHERE account_email = $1;
    `;
    const result = await pool.query(sql, [account_email]);
    console.log("Get Account By Email Result:", result.rows[0]); // Debug query result
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountByEmail:", error); // Log the error
    throw new Error("No matching email found."); // Throw a generic error
  }
}

/* *****************************
 * Export Model Functions
 * *************************** */
module.exports = {
  registerAccount, // Export the register function
  verifyCredentials, // Export the login verification function
  getAccountByEmail, // Export the function to get account by email
};
