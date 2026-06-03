const { default: rateLimit } = require("express-rate-limit")

exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts, pls try again after 15 mins"
    },
    skipSuccessfulRequests: true
})