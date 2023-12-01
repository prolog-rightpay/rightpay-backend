const express = require("express")
const Joi = require("joi")
const { insertCashbackReward } = require("../../../../../src/db/wallet/global/cashbackReward")
const { insertManyRewardConditions } = require("../../../../../src/db/wallet/global/rewardCondition")
const { determineInvalidKey } = require("../../../../../src/express")
const { isAdmin } = require("../../../../../src/middleware/admin")
const { CashbackReward } = require("../../../../../src/models/CashbackReward")
const { RewardCondition } = require("../../../../../src/models/RewardCondition")
const { RewardDuration } = require("../../../../../src/models/RewardDuration")
const router = express.Router()

router.use("/", isAdmin)

router.post("/", async (req, res) => {
    const schema = Joi.object({
        payment_method_id: Joi.string().required(),
        type: Joi.string().valid("percentage", "reimburse").required(),
        spending_min: Joi.number().required(),
        spending_max: Joi.number().required(),
        spending_cycle: Joi.string().valid("annually", "quarterly", "monthly", "daily", "cycle").required(),
        percentage: Joi.number().when("type", { is: "percentage", then: Joi.required() }),
        reimburse_amount: Joi.number().when("type", { is: "reimburse", then: Joi.required() }),
        is_enrollment_required: Joi.boolean().required(),
        is_introductory_offer: Joi.boolean().required(),
        durations: Joi.array().items(
            Joi.object({
                type: Joi.string().valid("date", "period").required(),
                expiration_date: Joi.date().when("type", { is: "date", then: Joi.required() }),
                period_days: Joi.number().when("type", { is: "period", then: Joi.required() }),
            })),
        conditions: Joi.array().items(
            Joi.object({
                type: Joi.string().valid("location", "location_category").required(),
                location_name: Joi.when("type", {
                    is: "location",
                    then: Joi.string().required(),
                    otherwise: Joi.forbidden()
                }),
                location_zip_code: Joi.when("type", {
                    is: "location",
                    then: Joi.string().allow(null).optional(),
                    otherwise: Joi.forbidden()
                }),
                location_category: Joi.when("type", {
                    is: "location_category",
                    then: Joi.string().required(),
                    otherwise: Joi.forbidden()
                }),
                location_name_exclusions: Joi.when("type", {
                    is: "location_category",
                    then: Joi.array().items(Joi.string()).default([]),
                    otherwise: Joi.array().forbidden()
                })
            })
        ).required(),
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

    const { payment_method_id: paymentMethodId, type, spending_min: spendingMin, spending_max: spendingMax, spending_cycle: spendingCycle, percentage,
        reimburse_amount: reimburseAmount,
        is_enrollment_required: isEnrollmentRequired, is_introductory_offer: isIntroductoryOffer } = req.body

    const durations = req.body.durations.reduce((items, item) => {
        const duration = new RewardDuration()
        switch (item.type) {
            case "date":
                duration.setExpirationDate(item.expiration_date)
                break
            case "period":
                duration.setPeriodDays(item.period_days)
                break
            default:
                return items
        }
        items.push(duration)
        return items
    }, [])

    const reward = new CashbackReward(null, isEnrollmentRequired, isIntroductoryOffer, null, null, true,
        req.app.account.id, null)
    switch (type) {
        case "percentage":
            reward.setTypePercentage(percentage, spendingMin, spendingMax, spendingCycle)
            break
        case "reimburse":
            reward.setTypeReimburse(reimburseAmount, spendingMin, spendingMax, spendingCycle)
            break
    }
    reward.durations = durations

    const globalWalletDb = req.app.get("db").globalWallet

    // insert cashback rewards
    try {
        await insertCashbackReward(globalWalletDb, reward, paymentMethodId)
    } catch (err) {
        console.log(err)
        res.status(422).json({
            success: false,
            message: err.message
        })
        return
    }

    // insert conditions
    const conditions = req.body.conditions.map(data => {
        const condition = new RewardCondition()
        if (data.type == "location") {
            condition.setLocation(data.location_name, data.location_zip_code)
        } else if (data.type == "location_category") {
            condition.setLocationCategory(data.location_category, data.location_name_exclusions)
        }
        return condition
    })

    try {
        await insertManyRewardConditions(globalWalletDb, conditions, reward.id)
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(422).json({
            success: false,
            message: err.message
        })
        return
    }
})

module.exports = router
