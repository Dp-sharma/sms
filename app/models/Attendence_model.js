// models/Attendance.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const AttendanceSchema = new Schema({
  date: { type: Date, required: true },
  class: {
    number: { type: Number, required: true },
    section: { type: String, required: true }
  },
  records: [{
    rollNo: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
  }]
});

const Attendance = mongoose.models["Attendance"] || mongoose.model('Attendance', AttendanceSchema);
export default Attendance;
