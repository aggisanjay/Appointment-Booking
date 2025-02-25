const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { addMinutes,parse } = require('date-fns');

exports.createAppointment = async (req, res) => {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;
  
    try {
      // Find the doctor by ID
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }
  
      // Check if the appointment time is available (no conflicts)
      const existingAppointments = await Appointment.find({
        doctorId,
        date: {
          $lt: new Date(date).getTime() + duration * 60 * 1000, // Adds duration to start time
          $gte: new Date(date).getTime(),
        },
      });
  
      if (existingAppointments.length > 0) {
        return res.status(400).json({ error: 'The requested time slot is already booked.' });
      }
  
      // Create new appointment
      const newAppointment = new Appointment({
        doctorId,
        date,
        duration,
        appointmentType,
        patientName,
        notes,
      });
  
      await newAppointment.save();
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Retrieve all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

  // Check if the doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }

  // Check if the requested slot is available
  const existingAppointments = await Appointment.find({
    doctorId,
    date: { $lte: addMinutes(new Date(date), duration), $gte: date },
  });

  if (existingAppointments.length > 0) {
    return res.status(400).json({ error: 'The selected time slot is not available.' });
  }

  const newAppointment = new Appointment({ doctorId, date, duration, appointmentType, patientName, notes });
  
  try {
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get appointment id
exports.getAppointmentDetails = async (req, res) => {
    try {
      const { id } = req.params; // Extract the appointment ID from the URL
  
      // Find the appointment by ID
      const appointment = await Appointment.findById(id);
  
      // If appointment not found, return a 404 error
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      // Return the appointment details
      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
// Update an existing appointment
// Update Appointment API logic
exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, duration, appointmentType, patientName, notes } = req.body;

        // Find the appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) return res.status(404).json({ error: "Appointment not found" });

        // Find the doctor
        const doctor = await Doctor.findById(appointment.doctorId);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        // Convert date properly
        const updatedStartDate = new Date(date);
        if (isNaN(updatedStartDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        const updatedEndDate = new Date(updatedStartDate.getTime() + duration * 60000);

        // Check for conflicts
        const conflictingAppointments = await Appointment.find({
            doctorId: appointment.doctorId,
            _id: { $ne: id }, // Ignore the current appointment
            $or: [
                { date: { $gte: updatedStartDate, $lt: updatedEndDate } }, 
                { date: { $lt: updatedStartDate, $gte: updatedEndDate } },
            ],
        });

        if (conflictingAppointments.length > 0) {
            return res.status(400).json({ error: "The selected time slot is already booked" });
        }

        // Update appointment details
        appointment.date = updatedStartDate;
        appointment.duration = duration;
        appointment.appointmentType = appointmentType;
        appointment.patientName = patientName;
        appointment.notes = notes || appointment.notes;

        await appointment.save();
        res.status(200).json({ message: "Appointment updated successfully", appointment });
    } catch (error) {
        console.error("Update Appointment Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

  

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(204).send("Deleted successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
