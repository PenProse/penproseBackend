const express = require('express')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const { handleShowUsers } = require('../Controllers/Controller')
const router = express.Router()

router.get('/showUsers',verifyUserAuth, handleShowUsers)

module.exports = router