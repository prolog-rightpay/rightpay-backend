const dbHelper = {
    account: require("../db/account")
}

async function sessionAuth(req, res, next) {
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

    console.log(accountsDb)
    console.log(sessionToken)

    let validated
    try {
        validated = await dbHelper.account.validateSessionToken(accountsDb, sessionToken)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        return
    }
    console.log(validated)
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