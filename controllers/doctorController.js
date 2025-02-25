const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Create a new doctor
exports.createDoctor = async (req, res) => {
    const { name, workingHours, specialization } = req.body;
  
    try {
      const newDoctor = new Doctor({
        name,
        workingHours,
        specialization,
      });
  
      await newDoctor.save();
      res.status(201).json(newDoctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
// Retrieve all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get available slots for a specific doctor on a specific date
const { parse, format, addMinutes, differenceInMinutes } = require('date-fns');

exports.getAvailableSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  const doctor = await Doctor.findById(id);
  
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }

  // Convert date to date object
  const startOfDay = parse(`${date}T${doctor.workingHours.start}:00`, "yyyy-MM-dd'T'HH:mm:ss", new Date());
  const endOfDay = parse(`${date}T${doctor.workingHours.end}:00`, "yyyy-MM-dd'T'HH:mm:ss", new Date());

  // Get appointments for this doctor on the given date
  const appointments = await Appointment.find({
    doctorId: id,
    date: { $gte: startOfDay, $lt: endOfDay },
  });

  let availableSlots = [];
  let currentSlot = startOfDay;

  while (differenceInMinutes(endOfDay, currentSlot) >= 30) {
    // Check if this slot is taken
    const isSlotTaken = appointments.some(appointment => {
      const appointmentStart = appointment.date;
      const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
      return currentSlot < appointmentEnd && addMinutes(currentSlot, 30) > appointmentStart;
    });

    if (!isSlotTaken) {
      availableSlots.push(format(currentSlot, 'HH:mm'));
    }

    currentSlot = addMinutes(currentSlot, 30);
  }

  res.json(availableSlots);
};
