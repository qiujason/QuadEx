const express = require('express')
const adminControllers = require('../controllers/admin.controllers')
const router = express.Router();

router.get('/', adminControllers.getAdmin)
router.post('/', adminControllers.postAdmin)
router.put('/', adminControllers.putAdmin)
router.delete('/', adminControllers.deleteAdmin)

module.exports = router