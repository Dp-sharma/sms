const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
  },
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
  subject: {
    type: String,
    required: function() {
      // Subject is required if the role is "Teacher"
      return this.role === 'Teacher';
    },
    validate: {
      validator: function(v) {
        // Ensure that a subject is given when the role is "Teacher"
        return this.role !== 'Teacher' || (v && v.trim() !== '');
      },
      message: 'Subject is required for Teachers',
    },
  },
});

// Middleware to validate classTeacher and subject fields based on position and role
userSchema.pre('save', function(next) {
  if (this.position === 'Staff' && this.role === 'Teacher') {
    // Ensure that className and section are provided for Teachers
    if (!this.classTeacher.className || !this.classTeacher.section) {
      return next(new Error('ClassName and Section are required for Teachers'));
    }
    // Ensure subject is provided if the role is Teacher
    if (!this.subject) {
      return next(new Error('Subject is required for Teachers'));
    }
  } else {
    this.classTeacher = undefined; // Remove classTeacher if not applicable
    this.subject = undefined; // Remove subject if not applicable
  }
  next();
});

const User = mongoose.models["User"] || mongoose.model('User', userSchema);

export default User;
