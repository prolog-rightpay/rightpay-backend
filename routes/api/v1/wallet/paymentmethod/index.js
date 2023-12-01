const express = require("express")
const { getPaymentMethods, paymentMethodToJson } = require("../../../../../src/db/wallet/global/paymentmethod")
const router = express.Router()

router.use("/new", require("./new"))

router.get("/", async (req, res) => {
    const globalWalletDb = req.app.get("db").globalWallet
    try {
        const paymentMethods = await getPaymentMethods(globalWalletDb)
        const resPaymentMethods = paymentMethods.map(paymentMethodToJson)
        res.json({
            success: true,
            data: {
                global_payment_methods: resPaymentMethods
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
    
})

exports.router = router