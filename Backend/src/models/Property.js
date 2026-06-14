const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: ['Apartment', 'House', 'Studio'],
        message: 'Property type must be Apartment, House, or Studio',
      },
    },
    listingType: {
      type: String,
      required: [true, 'Listing type is required'],
      enum: {
        values: ['rent', 'sale'],
        message: 'Listing type must be rent or sale',
      },
      default: 'rent',
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search performance
propertySchema.index({ city: 1, price: 1 });
propertySchema.index({ author: 1 });

module.exports = mongoose.model('Property', propertySchema);
