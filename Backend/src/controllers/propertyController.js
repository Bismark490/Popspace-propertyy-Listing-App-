const propertyService = require('../services/propertyService');

const getAllProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, type, listingType } = req.query;
    const properties = await propertyService.getAllProperties({
      city,
      minPrice,
      maxPrice,
      type,
      listingType,
    });
    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error fetching properties',
    });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await propertyService.getMyProperties(req.user._id);
    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error fetching your listings',
    });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error fetching property',
    });
  }
};

const createProperty = async (req, res) => {
  try {
    const property = await propertyService.createProperty(
      req.user._id,
      req.body
    );
    return res.status(201).json({
      success: true,
      message: 'Property listed successfully',
      data: property,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error creating property',
    });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await propertyService.updateProperty(
      req.params.id,
      req.user._id,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error updating property',
    });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const result = await propertyService.deleteProperty(
      req.params.id,
      req.user._id
    );
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error deleting property',
    });
  }
};

module.exports = {
  getAllProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
