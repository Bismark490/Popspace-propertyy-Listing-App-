const express = require('express');
const { body } = require('express-validator');
const {
  getAllProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const propertyValidators = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom((val) => val >= 0).withMessage('Price cannot be negative'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  body('type')
    .notEmpty().withMessage('Property type is required')
    .isIn(['Apartment', 'House', 'Studio']).withMessage('Type must be Apartment, House, or Studio'),
  body('listingType')
    .notEmpty().withMessage('Listing type is required')
    .isIn(['rent', 'sale']).withMessage('Listing type must be rent or sale'),
];

// GET /api/properties  — public
router.get('/', getAllProperties);

// GET /api/properties/mine — protected (must be before /:id)
router.get('/mine', protect, getMyProperties);

// GET /api/properties/:id — public
router.get('/:id', getPropertyById);

// POST /api/properties — protected
router.post('/', protect, propertyValidators, validate, createProperty);

// PUT /api/properties/:id — protected (author only — enforced in service)
router.put('/:id', protect, propertyValidators, validate, updateProperty);

// DELETE /api/properties/:id — protected (author only — enforced in service)
router.delete('/:id', protect, deleteProperty);

module.exports = router;
