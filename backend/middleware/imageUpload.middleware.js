const multer = require('multer')

const imageUpload = multer({
    dest: 'images'
})

module.exports = {imageUpload}