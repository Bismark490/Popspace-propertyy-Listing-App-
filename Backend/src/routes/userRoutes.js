const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// GET /api/users/profile
router.get('/profile', getProfile);

// PUT /api/users/profile
router.put(
  '/profile',
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('phone')
      .optional()
      .trim(),
    body('avatar')
      .optional()
      .trim()
      .isURL().withMessage('Avatar must be a valid URL'),
  ],
  validate,
  updateProfile
);

// PUT /api/users/password
router.put(
  '/password',
  [
    body('oldPassword')
      .notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  changePassword
);

module.exports = router;
