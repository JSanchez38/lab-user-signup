const User = require('../models/user.model')
const sessions = []

module.exports.sessions = sessions

module.exports.loadUser = (req, res, next) => {
    const cookieHeader = req.headers.cookieHeader
    const sessionId = cookieHeader?.split('sessionId=')?.[1]
    const session = sessions.find((session) => session.sessionId = sessionId)

    if (session) {
        User.findById(session.userId)
            .then((user) => {
                req.user = user
                res.locals.user = user
                next()
            })
            .catch(next)
    } else {
        next()
    }
}