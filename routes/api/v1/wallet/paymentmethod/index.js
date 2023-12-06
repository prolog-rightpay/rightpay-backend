const express = require("express")
const { getCashbackRewardsFromPaymentMethod } = require("../../../../../src/db/wallet/global/cashbackReward")
const { issuerFromId } = require("../../../../../src/db/wallet/global/issuer")
const { getPaymentMethods, getPaymentMethod } = require("../../../../../src/db/wallet/global/paymentmethod")
const { isAdmin } = require("../../../../../src/middleware/admin")
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

router.use("/", isAdmin)
router.get("/:id/cashbackrewards", async (req, res) => {
    const globalWalletDb = req.app.get("db").globalWallet

    const { id } = req.params
    const paymentMethod = await getPaymentMethod(globalWalletDb, id)
    if (!paymentMethod) {
        res.status(422).json({
            success: false,
            message: "Invalid payment method ID"
        })
        return
    }
    const rewards = await getCashbackRewardsFromPaymentMethod(globalWalletDb, paymentMethod)
    const rewardsJson = rewards.map(r => r.toJson(true))
    res.json({
        success: true,
        data: {
            cashback_rewards: rewardsJson
        }
    })
})
