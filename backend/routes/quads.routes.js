const express = require('express')
const quadControllers = require('../controllers/quad.controllers')
const router = express.Router();

router.get('/', quadControllers.getQuad)
router.post('/', quadControllers.postQuad)
router.post('/event', quadControllers.postQuadEvent)
router.put('/', quadControllers.putQuad)
router.delete('/', quadControllers.deleteQuad)
router.delete('/event', quadControllers.deleteQuadEvent)

module.exports = router