function isAdmin(req, res, next) {
    const account = req.app.account
    if (account.isAdmin) {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: "Invalid authorization"
        })
    }
}
exports.isAdmin = isAdmin
