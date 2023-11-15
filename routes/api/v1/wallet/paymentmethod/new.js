const express = require("express")
const Joi = require("joi")
const { insertGlobalPaymentMethod } = require("../../../../../src/db/wallet/global/paymentmethod")
const { determineInvalidKey } = require("../../../../../src/express")
const { isAdmin } = require("../../../../../src/middleware/admin")
const { GlobalPaymentMethod } = require("../../../../../src/models/GlobalPaymentMethod")
const router = express.Router()

router.use("/", isAdmin)

// account endpoint requires session auth

router.post("/", async (req, res) => {
    const schema = Joi.object({
        payment_type: Joi.string().regex(/^credit$/).required(),
        network_type: Joi.string().regex(/^(visa|mastercard|amex|discover)$/).required(),
        name: Joi.string().required(),
        issuer_id: Joi.string().required(),
        image_url: Joi.string().optional().allow(null)
    })
    const validate = schema.validate(req.body)
    if (validate.error != null) {
        let message = "Invalid data"
        const invalidKey = determineInvalidKey(validate.error)
        if (invalidKey) {
            message = "Invalid " + invalidKey
        }
        res.status(422).json({
            success: false,
            message: message
        })
        return
    }

    const { payment_type: paymentType, network_type: networkType,
        name, issuer_id: issuerId, image_url: imageUrl } = req.body
    const paymentMethod = new GlobalPaymentMethod(null, paymentType, networkType, name, issuerId, imageUrl)

    const globalWalletDb = req.app.get("db").globalWallet
    try {
        await insertGlobalPaymentMethod(globalWalletDb, paymentMethod)
        res.json({
            success: true
        })
    } catch (err) {
        res.status(422).json({
            success: false,
            message: err.message
        })
    }
    
})
module.exports = router
