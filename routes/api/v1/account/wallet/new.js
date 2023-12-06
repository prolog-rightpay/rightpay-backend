const express = require("express")
const Joi = require("joi")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")

const { sessionAuth } = require("../../../../../src/middleware/auth")
router.use("/", sessionAuth)


router.post("/", async (req, res) => {
    const schema = Joi.object({
        global_payment_method_id: Joi.string().required(),
        bin: Joi.string().optional().allow(null),
        name: Joi.string().optional().allow(null)
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
    
    const { global_payment_method_id: globalPaymentMethodId, bin, name } = req.body
    const db = req.app.get("db").userWallet

    const doc = {
        id: uuidv4(),
        account_id: req.app.account.id,
        global_payment_method_id: globalPaymentMethodId,
        bin: bin,
        date_created: new Date(),
        name: name
    }
    const paymentMethodsColl = db.collection("account_payment_methods")
    try {
        await paymentMethodsColl.insertOne(doc)
        res.json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Unexpected error occured"
        })
    }
    

})

module.exports = router
