const { validateSessionToken } = require("../db/account")

async function sessionAuth(req, res, next) {
    if (req.method === "OPTIONS") {
        return res.sendStatus(200)
    }
    
    const accountsDb = req.app.get("db").accounts

    const authHeader = req.headers["authorization"]
    const bearer = "Bearer "
    if (!authHeader?.startsWith(bearer)) {
        res.status(403).json({
            success: false,
            message: "Missing authorization"
        })
        return
    }
    const sessionToken = authHeader.slice(bearer.length)

    let validated
    try {
        validated = await validateSessionToken(accountsDb, sessionToken)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        return
    }
    if (!validated) {
        res.status(403).json({
            success: false,
            message: "Invalid authorization"
        })
        return
    }
    req.app.account = validated.account
    req.app.session = validated.session
    next()
}
exports.sessionAuth = sessionAuth