const express = require('express')
const pointsController = require('../controllers/points.controllers')
const router = express.Router();

router.get('/user', pointsController.getPointsByUserID)
router.get('/user/sum', pointsController.getSumPointsByUserID)
router.get('/quad', pointsController.getPointsByQuad)
router.get('/quad/sum', pointsController.getSumPointsByQuad)
router.post('/', pointsController.postPoints)
// router.put('/', pointsController.putPoints)
router.delete('/', pointsController.deletePoints)

module.exports = router