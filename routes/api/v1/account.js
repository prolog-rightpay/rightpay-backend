const express = require("express")
const router = express.Router()

// /account endpoint requires session auth
const { sessionAuth } = require("../../../src/middleware/auth")
router.use("/", sessionAuth)

router.get("/", (req, res) => {
    const account = req.app.account
    const accountData = {
        id: account.id,
        email: account.email,
        first_name: account.firstName,
        last_name: account.lastName,
        date_created: account.dateCreated?.toISOString()
    }
    if (account.isAdmin) {
        accountData.is_admin = account.isAdmin
    }
    res.json({
        success: true,
        data: {
            account: accountData
        }
    })
})

module.exports = router
