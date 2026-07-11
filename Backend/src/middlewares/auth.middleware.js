const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

const fallbackJwtSecret = "development-fallback-secret-change-me"
const jwtSecret = process.env.JWT_SECRET || fallbackJwtSecret

if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET is missing from the runtime environment. Falling back to a development-only secret.")
}

async function authUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, jwtSecret)

        req.user = decoded

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token."
        })
    }

}


module.exports = { authUser }