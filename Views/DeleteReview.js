const express = require('express')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const { handleDeleteReview } = require('../Controllers/Controller')
const router = express.Router()

router.delete('/deleteReview/:id', verifyUserAuth, handleDeleteReview)

module.exports = router