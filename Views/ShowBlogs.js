const express = require('express')
const { handleShowBlogs } = require('../Controllers/Controller')
const router = express.Router()

router.get('/showBlogs', handleShowBlogs)

module.exports = router