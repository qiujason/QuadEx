const express = require('express')
const eventsControllers = require('../controllers/events.controllers')
const favoriteEventsControllers = require('../controllers/favoriteEvents.controllers')
const router = express.Router();

router.get('/', eventsControllers.getEvents)
router.post('/', eventsControllers.postEvents)
router.put('/', eventsControllers.putEvents)
router.delete('/', eventsControllers.deleteEvents)

router.get('/favoriteByUser', favoriteEventsControllers.getFavoriteEventsByUser)
router.get('/listUsers', favoriteEventsControllers.getUsersByFavoriteEvents)
router.post('/favoriteForUser', favoriteEventsControllers.postFavoriteEvents)
router.delete('/favoriteForUser', favoriteEventsControllers.deleteFavoriteEvents)

module.exports = router