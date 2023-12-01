const { CashbackReward } = require("../../../models/CashbackReward")
const { rewardConditionsForCashbackReward } = require("./rewardCondition")

async function insertCashbackReward(db, cashbackReward, paymentMethodId) {
    const { id, dateCreated, dateModified,
        isApproved, authorAccountId, approverAccountId,
        type, spendingMin, spendingMax, spendingCycle,
        percentage, reimburseAmount, isEnrollmentRequired, isIntroductoryOffer, durations } = cashbackReward

    console.log("TODO!!!! pull conditions from db!!!")

    const cashbackRewardsColl = db.collection("cashback_rewards")

    const durationsDoc = durations.reduce((items, duration) => {
        switch (duration.type) {
            case "date":
                items.push({
                    type: "date",
                    expiration_date: duration.expirationDate
                })
                break
            case "period":
                items.push({
                    type: "period",
                    period_days: duration.periodDays
                })
                break
            default:
                return items
        }
        return items
    }, [])

    const cashbackRewardsDoc = {
        id: id,
        payment_method_id: paymentMethodId,
        date_created: dateCreated,
        date_modified: dateModified,
        is_approved: isApproved,
        author_account_id: authorAccountId,
        approver_account_id: approverAccountId,
        type: type,
        spending_min: spendingMin,
        spending_max: spendingMax,
        spending_cycle: spendingCycle,
        percentage: percentage,
        reimburse_amount: reimburseAmount,
        is_enrollment_required: isEnrollmentRequired,
        is_introductory_offer: isIntroductoryOffer,
        durations: durationsDoc
    }
    await cashbackRewardsColl.insertOne(cashbackRewardsDoc)    
}
exports.insertCashbackReward = insertCashbackReward

async function getCashbackReward(db, id) {
    const cashbackRewardsColl = db.collection("cashback_rewards")
    const result = await cashbackRewardsColl.findOne({ id: id })
    let cashbackReward = CashbackReward.fromDoc(result)

    const conditions = await rewardConditionsForCashbackReward(db, cashbackReward)
    cashbackReward.conditions = conditions

    return cashbackReward
}
exports.getCashbackReward = getCashbackReward

async function getCashbackRewardsFromPaymentMethod(db, paymentMethod) {
    const cashbackRewardsColl = db.collection("cashback_rewards")
    const resultsCur = await cashbackRewardsColl.find({ payment_method_id: paymentMethod.id })
    const results = await resultsCur.toArray()

    let cashbackRewards = results.map(CashbackReward.fromDoc)
    cashbackRewards = await Promise.all(cashbackRewards.map(async cashbackReward => {
        const conditions = await rewardConditionsForCashbackReward(db, cashbackReward)
        cashbackReward.conditions = conditions
        return cashbackReward
    }))

    return cashbackRewards
}
exports.getCashbackRewardsFromPaymentMethod = getCashbackRewardsFromPaymentMethod
