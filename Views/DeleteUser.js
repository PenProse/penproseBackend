const express = require('express')
const router = express.Router()
const { verifyUserAuth } = require('../MiddleWares/Auth')
const { handleDeleteUser } = require('../Controllers/Controller')


router.delete('/deleteUser/:id', verifyUserAuth, handleDeleteUser)

module.exports = router