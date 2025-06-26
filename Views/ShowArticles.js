const express = require('express')
const { handleShowArticles } = require('../Controllers/Controller')
const router = express.Router()


router.get('/showArticles', handleShowArticles)

module.exports = router