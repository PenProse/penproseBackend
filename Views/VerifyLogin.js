const exprses = require('express')
const { verifyUserAuth } = require('../MiddleWares/Auth')
const router = exprses.Router()


router.get('/verifyLogin', verifyUserAuth, (req, res) => {
    try {
        res.json({
            'success': true
        })
    } catch (error) {
        res.json({
            'success': false
        })
    }
})

module.exports = router