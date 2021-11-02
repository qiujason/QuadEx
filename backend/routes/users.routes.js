const express = require('express')
const userControllers = require('../controllers/users.controllers')
const router = express.Router();

router.get('/', userControllers.getUsers)
router.post('/', userControllers.postUsers)
router.put('/', userControllers.putUsers)
router.delete('/', userControllers.deleteUsers)

module.exports = router