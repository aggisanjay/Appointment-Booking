const express = require('express');
const { createDoctor,getDoctors, getAvailableSlots } = require('../controllers/doctorController');

const router = express.Router();
router.post('/', createDoctor);
router.get('/', getDoctors);
router.get('/:id/slots', getAvailableSlots);

module.exports = router;

