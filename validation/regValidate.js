const { body, validationResult } = require('express-validator');

const loginRules = () => [
  body('account_email')
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('account_password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
];

const checkLoginData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('notice', 'Login validation failed. Please check your input.');
    return res.status(400).render('account/login', {
      title: 'Login',
      nav: req.nav, // Assuming nav middleware is in place
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  loginRules,
  checkLoginData,
};
