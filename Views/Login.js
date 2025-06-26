const express = require('express')
const { handleLogin } = require('../Controllers/Controller')
const router = express.Router()

router.post('/login', handleLogin)

module.exports = router
