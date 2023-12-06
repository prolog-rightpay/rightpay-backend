const express = require("express")
const router = express.Router()

const { getPaymentMethod } = require("../../../../../src/db/wallet/global/paymentMethod")

const { sessionAuth } = require("../../../../../src/middleware/auth")
router.use("/", sessionAuth)

router.use("/new", require("./new"))

router.get("/", async (req, res) => {
    const db = req.app.get("db").userWallet
    const globalWalletDb = req.app.get("db").globalWallet
    const col = db.collection("account_payment_methods")

    let cur = col.find({
        account_id: req.app.account.id
    })
    const methodDocs = (await cur.toArray())
        .sort((x, y) => x.date_created - y.date_created)
    const methods = await Promise.all(methodDocs.map(async doc => {
        const { id, global_payment_method_id: paymentMethodId, bin, date_created: dateCreated, name } = doc
        const paymentMethod = await getPaymentMethod(globalWalletDb, paymentMethodId)
        return {
            id: id,
            payment_method: paymentMethod.toJson(),
            bin: bin,
            date_created: dateCreated,
            name: name
        }
    }))

    res.json({
        success: true,
        data: {
            payment_methods: methods
        }
    })
})

module.exports = router
