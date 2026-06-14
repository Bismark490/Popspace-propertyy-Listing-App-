const propertyRepository = require('../repositories/propertyRepository');

const getAllProperties = async (filters) => {
  return await propertyRepository.getAllProperties(filters);
};

const getMyProperties = async (userId) => {
  return await propertyRepository.getPropertiesByAuthor(userId);
};

const getPropertyById = async (id) => {
  const property = await propertyRepository.getPropertyById(id);
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }
  return property;
};

const createProperty = async (userId, propertyData) => {
  return await propertyRepository.createProperty({
    ...propertyData,
    author: userId,
  });
};

const updateProperty = async (propertyId, userId, updateData) => {
  // Fetch property first to verify ownership
  const property = await propertyRepository.getPropertyById(propertyId);
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  // Strict ownership check — block non-authors at the service level
  if (property.author._id.toString() !== userId.toString()) {
    const error = new Error('You are not authorized to modify this listing');
    error.statusCode = 403;
    throw error;
  }

  return await propertyRepository.updatePropertyById(propertyId, updateData);
};

const deleteProperty = async (propertyId, userId) => {
  // Fetch property first to verify ownership
  const property = await propertyRepository.getPropertyById(propertyId);
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  // Strict ownership check
  if (property.author._id.toString() !== userId.toString()) {
    const error = new Error('You are not authorized to delete this listing');
    error.statusCode = 403;
    throw error;
  }

  await propertyRepository.deletePropertyById(propertyId);
  return { message: 'Property deleted successfully' };
};

module.exports = {
  getAllProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
