const userRepository = require('../repositories/userRepository');

const getProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, { username, phone, avatar }) => {
  // If changing username, check uniqueness
  if (username) {
    const existing = await userRepository.findUserByUsername(username);
    if (existing && existing._id.toString() !== userId) {
      const error = new Error('Username already taken');
      error.statusCode = 400;
      throw error;
    }
  }

  const updateData = {};
  if (username !== undefined) updateData.username = username;
  if (phone !== undefined) updateData.phone = phone;
  if (avatar !== undefined) updateData.avatar = avatar;

  const user = await userRepository.updateUserById(userId, updateData);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  // Fetch user with password
  const user = await userRepository.findUserByIdWithPassword(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify old password
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }

  // Update password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();

  return { message: 'Password updated successfully' };
};

module.exports = { getProfile, updateProfile, changePassword };
