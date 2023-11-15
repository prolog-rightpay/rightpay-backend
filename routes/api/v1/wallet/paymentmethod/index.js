const express = require("express")
const { getPaymentMethods } = require("../../../../../src/db/wallet/global/paymentmethod")
const router = express.Router()

router.use("/new", require("./new"))

function paymentMethodToJson(paymentMethod, includeIssuerId = true) {
    const { id, issuerId, name, imageUrl, paymentType } = paymentMethod
    let json = {
        id: id,
        issuer_id: issuerId,
        name: name,
        image_url: imageUrl,
        payment_type: paymentType
    }
    if (!includeIssuerId) {
        delete json.issuer_id
    }
    return json
}
exports.paymentMethodToJson = paymentMethodToJson

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