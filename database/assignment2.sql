-- 1. Insert a new account record for Tony Stark
INSERT INTO account (
		account_firstname,
		account_lastname,
		account_email,
		account_password
	)
VALUES (
		'Tony',
		'Stark',
		'tony@starkent.com',
		'Iam1ronM@n'
	);
-- 2. Update Tony Stark's account_type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- 3. Delete Tony Stark's account record
DELETE FROM account
WHERE account_email = 'tony@starkent.com';
-- 4. Update the GM Hummer description from "small interiors" to "a huge interior"
UPDATE inventory
SET inv_description = REPLACE(
		inv_description,
		'small interiors',
		'a huge interior'
	)
WHERE inv_make = 'GM'
	AND inv_model = 'Hummer';
-- 5. Select make, model, and classification name for inventory in the "Sport" category
SELECT i.inv_make,
	i.inv_model,
	c.classification_name
FROM inventory i
	INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- 6. Update image file paths in inventory table
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');