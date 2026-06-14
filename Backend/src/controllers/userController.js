const userService = require('../services/userService');

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user._id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error fetching profile',
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, phone, avatar } = req.body;
    const user = await userService.updateProfile(req.user._id, {
      username,
      phone,
      avatar,
    });
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error updating profile',
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user._id, {
      oldPassword,
      newPassword,
    });
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error changing password',
    });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
