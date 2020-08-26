const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    /* ----- Validate ----- */
    check('name', 'Please add Name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    /* ----- Check Result of Validation ----- */
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    /* ----- If you passed the Validation ----- */
    /* ---- Then Continue ----- */

    const { name, email, password } = req.body;

    try {
      /* FIND IF THERE'S AN EXISTING EMAIL ON THE DATABASE */
      // Return an Object
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // If it is null -- Register
      user = new User({
        name: name,
        email: email,
        password: password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // Registered User (Object) will get added to the Database
      await user.save();

      // API will return a TOKEN with POST request
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
