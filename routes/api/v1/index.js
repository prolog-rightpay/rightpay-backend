const express = require("express")
const router = express.Router()

router.use("/", (req, res, next) => {
    if (req.headers.origin == "http://localhost:3010") {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3010")
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin")
    } else if (req.headers.origin == "https://admin.userightpay.com") {
        res.setHeader("Access-Control-Allow-Origin", "https://admin.userightpay.com")
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin")
    }
    
    next()
})

router.use("/signin", require("./signin"))
router.use("/signup", require("./signup"))
router.use("/signout", require("./signout"))
router.use("/account", require("./account/index"))
router.use("/wallet", require("./wallet"))

module.exports = router