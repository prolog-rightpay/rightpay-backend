const express = require("express")
const { getCashbackRewardsFromPaymentMethod } = require("../../../../../src/db/wallet/global/cashbackReward")
const { issuerFromId } = require("../../../../../src/db/wallet/global/issuer")
const { getPaymentMethods } = require("../../../../../src/db/wallet/global/paymentmethod")
const router = express.Router()

router.use("/new", require("./new"))

router.get("/", async (req, res) => {
    const globalWalletDb = req.app.get("db").globalWallet

    const extendedQuery = req.query.extended
    const extended = req.app.account.isAdmin && extendedQuery != null

    try {
        let paymentMethods = await getPaymentMethods(globalWalletDb)
        if (extended) {
            paymentMethods = await Promise.all(paymentMethods.map(async paymentMethod => {
                const issuer = await issuerFromId(globalWalletDb, paymentMethod.issuerId, false)
                paymentMethod.issuer = issuer
                return paymentMethod
            }))

            paymentMethods = await Promise.all(paymentMethods.map(async paymentMethod => {
                const cashbackRewards = await getCashbackRewardsFromPaymentMethod(globalWalletDb, paymentMethod)
                paymentMethod.cashbackRewards = cashbackRewards
                return paymentMethod
            }))
        }

        const resPaymentMethods = paymentMethods.map(paymentMethod => {
            const json = paymentMethod.toJson(extended)
            if (extended) {
                json.issuer = paymentMethod.issuer.toJson()
            }
            return json
        })

        res.json({
            success: true,
            data: {
                global_payment_methods: resPaymentMethods
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
    
})

exports.router = router