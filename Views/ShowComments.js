const express = require('express')
const { handleShowComments } = require('../Controllers/Controller')
const router = express.Router()

router.get('/showComments/:id', handleShowComments)

module.exports = router