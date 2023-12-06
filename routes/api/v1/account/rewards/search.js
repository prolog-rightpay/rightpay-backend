const express = require("express")
const router = express.Router()

const { sessionAuth } = require("../../../../../src/middleware/auth")
router.use("/", sessionAuth)

router.get("/:location_type/:query", async (req, res) => {
    const { location_type: locationType, query } = req.params

    const { userWallet: userWalletDb, globalWallet: globalWalletDb } = req.app.get("db")
    
    // 1. find all payment method ids a user owns
    const userMethods = userWalletDb.collection("account_payment_methods")
    let cur = userMethods.find({ account_id: req.app.account.id })
    const globalPaymentMethodIds = (await cur.toArray()).map(i => i.global_payment_method_id)

    console.log("global payment method ids:")
    console.log(globalPaymentMethodIds)

    // 2. complete the search
    const pipeline = [
        {
          $match: {
            $and: [
              { location_type: 'location_category' },
              { location_category: query },
              { cashback_reward_id: { $exists: true } }
            ]
          }
        },
        {
          $lookup: {
            from: 'cashback_rewards', // Replace with the actual name of the reward collection
            localField: 'cashback_reward_id',
            foreignField: 'id', // Assuming the _id field is used as the reference in cashback_reward_id
            as: 'cashback_reward'
          }
        },
        {
          $match: {
            $or: [
              { 'cashback_reward.payment_method_id': { $in: globalPaymentMethodIds } },
            ]
          }
        }
      ];

    const rewardConditionsDb = globalWalletDb.collection("cashback_reward_conditions")
    const matches = (await rewardConditionsDb.aggregate(pipeline).toArray())
      .map(condition => {
        const reward = condition.cashback_reward[0]
        delete condition.cashback_reward
        reward.condition = condition
        return reward
      })
    console.log(matches)

    // console.log(`searching for ${query}`)
    // console.log("matches:")
    // console.log(matches)
    // console.log()

    res.json({
        success: true,
        data: {
            matching_rewards: matches
        }
    })

})

module.exports = router
