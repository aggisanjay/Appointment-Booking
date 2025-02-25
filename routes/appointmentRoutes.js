const express = require('express');
const { getAppointments,getAppointmentDetails ,createAppointment, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');

const router = express.Router();
router.post('/', createAppointment);
router.get('/', getAppointments);
router.post('/', createAppointment);
router.get('/:id', getAppointmentDetails);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;

