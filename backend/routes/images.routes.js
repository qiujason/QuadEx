const express = require('express')
const imageMiddleware = require('../middleware/imageUpload.middleware')
const imagesControllers = require('../controllers/images.controllers')
const router = express.Router();

router.get('/:filename', imagesControllers.getImage)
router.post('/:filename', imageMiddleware.imageUpload.single('image'), imagesControllers.postImage)
router.delete('/:filename', imagesControllers.deleteImage)

module.exports = router