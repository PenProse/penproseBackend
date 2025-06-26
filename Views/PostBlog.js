const express = require('express')
const router = express.Router()
const {verifyUserAuth} = require('../MiddleWares/Auth')
const { handlePostBlog } = require('../Controllers/Controller')

router.post('/postBlog', verifyUserAuth , handlePostBlog)

module.exports = router