const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select('+password');
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const updateUserById = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const findUserByIdWithPassword = async (id) => {
  return await User.findById(id).select('+password');
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser,
  updateUserById,
  findUserByIdWithPassword,
};
