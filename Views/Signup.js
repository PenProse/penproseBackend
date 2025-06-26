const express = require('express')
const { handleSignup } = require('../Controllers/Controller')
const router = express.Router()

router.post('/signup', handleSignup)

module.exports = router