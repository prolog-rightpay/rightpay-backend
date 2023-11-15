const { CashbackReward } = require("../../../models/CashbackReward")

async function insertCashbackReward(db, cashbackReward, paymentMethodId) {
    const { id, dateCreated, dateModified,
        isApproved, authorAccountId, approverAccountId,
        type, spendingMin, spendingMax, spendingCycle,
        percentage, reimburseAmount, isEnrollmentRequired, isIntroductoryOffer, durations } = cashbackReward

    console.log("TODO!!!! pull conditions from db!!!")

    const cashbackRewardsColl = db.collection("cashback_rewards")

    const durationsBSON = durations.reduce((items, duration) => {
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

    const cashbackRewardsBSON = {
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
        durations: durationsBSON
    }
    await cashbackRewardsColl.insertOne(cashbackRewardsBSON)    
}
exports.insertCashbackReward = insertCashbackReward

function cashbackDurationFromBSON(bson) {
    const duration = new RewardDuration()
    switch (type) {
        case "date":
            duration.setExpirationDate(type.expiration_date)
            break
        case "period":
            duration.setPeriodDays(type.period_days)
            break
        default:
            throw new Error("Cashback reward duration has an invalid type")
    }
    return duration
}

function cashbackRewardFromBSON(bson) {
    const { id, date_created: dateCreated, date_modified: dateModified,
    is_approved: isApproved, author_account_id: authorAccountId, approver_account_id: approverAccountId,
    type, spending_min: spendingMin, spending_max: spendingMax, percentage, reimburse_amount: reimburseAmount,
    is_enrollment_required: isEnrollmentRequired, is_introductory_offer: isIntroductoryOffer } = bson

    const cashbackReward = new CashbackReward(id, isEnrollmentRequired, isIntroductoryOffer, dateCreated, dateModified)
    switch (type) {
        case "reimburse":
            cashbackReward.setTypeReimburse(reimburseAmount, spendingMin, spendingMax, spendingCycle)
            break
        case "percentage":
            cashbackReward.setTypePercentage(percentage, spendingMin, spendingMax, spendingCycle)
            break
        default:
            throw new Error("Invalid cashback reward type")
    }

    const durations = bson.durations.map(cashbackDurationFromBSON)
    cashbackReward.durations = durations

    return cashbackReward
}
