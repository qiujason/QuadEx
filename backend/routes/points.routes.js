const express = require('express')
const pointsController = require('../controllers/points.controllers')
const router = express.Router();

router.get('/', pointsController.getPointsByUserID)
router.get('/quad', pointsController.getPointsByQuad)
router.post('/', pointsController.postPoints)
// router.put('/', pointsController.putPoints)
router.delete('/', pointsController.deletePoints)

module.exports = router