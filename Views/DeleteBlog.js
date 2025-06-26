const express = require('express')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const { handleDeleteBlog } = require('../Controllers/Controller')
const router = express.Router()

router.delete('/deleteBlog/:id', verifyUserAuth, handleDeleteBlog)

module.exports = router