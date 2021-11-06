const express = require('express')
const eventsControllers = require('../controllers/events.controllers')
const router = express.Router();

router.get('/', eventsControllers.getEvents)
router.post('/', eventsControllers.postEvents)
router.put('/', eventsControllers.putEvents)
router.delete('/', eventsControllers.deleteEvents)

module.exports = router