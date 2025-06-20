const express = require('express')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const { handlePostComment } = require('../Controllers/Controller')
const router = express.Router()

router.post('/postComment', verifyUserAuth, handlePostComment)

module.exports = router