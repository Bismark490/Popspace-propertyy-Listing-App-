const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const registerUser = async ({ username, email, password }) => {
  // Check for existing email
  const existingEmail = await userRepository.findUserByEmail(email);
  if (existingEmail) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  // Check for existing username
  const existingUsername = await userRepository.findUserByUsername(username);
  if (existingUsername) {
    const error = new Error('Username already taken');
    error.statusCode = 400;
    throw error;
  }

  // Create user (password is hashed in model pre-save hook)
  const user = await userRepository.createUser({ username, email, password });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
    },
  };
};

const loginUser = async ({ email, password }) => {
  // Find user with password field included
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
    },
  };
};

module.exports = { registerUser, loginUser };
