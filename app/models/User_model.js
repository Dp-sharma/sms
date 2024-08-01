const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: false,
  },
  contact: {
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  bio: {
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  classTeacher: {
    className: {
      type: String,
      required: false,
    },
    section: {
      type: String,
      required: false,
    },
  },
});

// Middleware to validate classTeacher fields based on position
userSchema.pre('save', function(next) {
  if (this.position === 'Staff' && this.role === 'Teacher') {
    if (!this.classTeacher.className || !this.classTeacher.section) {
      return next(new Error('ClassName and Section are required for Teachers'));
    }
  } else {
    this.classTeacher = undefined; // Remove classTeacher if not applicable
  }
  next();
});

const User = mongoose.models["User"] || mongoose.model('User', userSchema);

export default User;
