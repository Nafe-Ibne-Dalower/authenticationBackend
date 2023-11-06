const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const fetchUser = (req,res,next)=>{
    // get the user from jwt token
    const token = req.header('auth-token')
    if(!token){
        res.status(401).json({'error': 'Access Denied'})
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).json({'error': 'Access Denied'})
    }
}

module.exports = fetchUser;