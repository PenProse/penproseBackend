const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = process.env.SECRET

const setUser = (user) => {
    const payload = {
        'name': user.name,
        'email': user.email,
        '_id': user._id
    }

    const token = jwt.sign(payload, secret)
    return token
}

const verifyUserAuth = (req, res, next) => {
    const token = req.cookies?.uid 
    if (!token) {
        res.json({
            'success': false,
            'message': 'Login First'
        })
    } else if (token) {
        const result = jwt.verify(token, secret)

        if(result) {
            next()
        } else {
            res.json({
                'success': false,
                'message': 'you are not authenticated'
            })
        }
    }
}


module.exports = {
    setUser,
    verifyUserAuth
}

