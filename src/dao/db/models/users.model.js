const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  role: {
    type: String,
    enum: ['User', 'Premium', 'Admin'],
    default: 'User'
  },
  documents: [{
    name: {
      type: String,
      required: true
    },
    reference: {
      type: String,
      required: true
    }
  }],
  last_connection: {
    type: Date
  }
}, {
  timestamps: true,
  strict: false
});

const User = mongoose.model('Users', UserSchema);

module.exports = User;
