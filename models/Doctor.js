const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: {
    start: { type: String, required: true }, // e.g., '09:00'
    end: { type: String, required: true },   // e.g., '17:00'
  },
  specialization: { type: String, required: false },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;

