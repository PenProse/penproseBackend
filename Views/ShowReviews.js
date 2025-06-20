const express = require('express')
const { handleShowReviews } = require('../Controllers/Controller')
const router = express.Router()

router.get('/showReviews', handleShowReviews)

module.exports = router