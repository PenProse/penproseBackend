const express = require('express')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const { handlePostReview } = require('../Controllers/Controller')
const router = express.Router()

router.post('/postReview', verifyUserAuth, handlePostReview)

module.exports = router