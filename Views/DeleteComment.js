const express = require('express')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const { handleDeleteComment } = require('../Controllers/Controller')
const router = express.Router()

router.delete('/deleteComment/:id', verifyUserAuth, handleDeleteComment)

module.exports = router