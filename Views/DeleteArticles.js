const express = require('express')
const { handleDelelteArticle } = require('../Controllers/Controller')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const router = express.Router()

router.delete('/delteArticle/:id', verifyUserAuth ,handleDelelteArticle)

module.exports = router