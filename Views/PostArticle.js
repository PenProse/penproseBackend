const express = require('express')
const { handlePostArticle } = require('../Controllers/Controller')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const router = express.Router()

router.post('/postArticle', verifyUserAuth ,handlePostArticle)

module.exports = router