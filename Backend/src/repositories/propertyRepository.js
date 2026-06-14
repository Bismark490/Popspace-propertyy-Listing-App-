const Property = require('../models/Property');

const getAllProperties = async (filters = {}) => {
  const query = {};

  if (filters.city) {
    query.city = { $regex: filters.city, $options: 'i' };
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.listingType) {
    query.listingType = filters.listingType;
  }

  return await Property.find(query)
    .populate('author', 'username email avatar')
    .sort({ createdAt: -1 });
};

const getPropertiesByAuthor = async (authorId) => {
  return await Property.find({ author: authorId })
    .populate('author', 'username email avatar')
    .sort({ createdAt: -1 });
};

const getPropertyById = async (id) => {
  return await Property.findById(id).populate('author', 'username email avatar phone');
};

const createProperty = async (propertyData) => {
  const property = new Property(propertyData);
  return await property.save();
};

const updatePropertyById = async (id, updateData) => {
  return await Property.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('author', 'username email avatar');
};

const deletePropertyById = async (id) => {
  return await Property.findByIdAndDelete(id);
};

module.exports = {
  getAllProperties,
  getPropertiesByAuthor,
  getPropertyById,
  createProperty,
  updatePropertyById,
  deletePropertyById,
};
