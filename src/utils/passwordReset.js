const jwt = require('jsonwebtoken');
const UserModel = require("../dao/db/models/users.model");
const PasswordResetModel = require("../dao/db/models/passwordreset.model");
const config = require('../config/config')

const generatePasswordResetToken = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return { error: "Usuario no encontrado" };
  }

  const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '1h' });

  await PasswordResetModel.create({
    user: user._id,
    token: token,
    expires: Date.now() + 3600000
  });

  return token;
};

const validatePasswordResetToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const user = await UserModel.findById(decodedToken.userId);
    if (!user) {
      return false;
    }

    const storedToken = await PasswordResetModel.findOne({ user: user._id, token: token });
    if (!storedToken || storedToken.expires < Date.now()) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { generatePasswordResetToken, validatePasswordResetToken };
