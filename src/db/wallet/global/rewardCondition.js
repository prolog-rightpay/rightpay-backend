const { RewardCondition } = require("../../../models/RewardCondition")

function docForRewardCondition(rewardCondition, cashbackRewardId) {
    const { id, type, locationCategory, locationNameExclusions, locationName, locationZipCode } = rewardCondition

    const doc = {
        id: id,
        cashback_reward_id: cashbackRewardId,
        type: type,
        location_category: locationCategory,
        location_name_exclusions: locationNameExclusions,
        location_name: locationName,
        location_zip_code: locationZipCode
    }
    return doc
}

async function insertRewardCondition(db, rewardCondition, cashbackRewardId) {
    const doc = docForRewardCondition(rewardCondition, cashbackRewardId)

    const rewardConditionsColl = db.collection("cashback_reward_conditions")
    await rewardConditionsColl.insertOne(doc)
}
exports.insertRewardCondition = insertRewardCondition

async function insertManyRewardConditions(db, rewardConditions, cashbackRewardId) {
    const docs = rewardConditions.map(condition => docForRewardCondition(condition, cashbackRewardId) )
    const rewardConditionsColl = db.collection("cashback_reward_conditions")
    await rewardConditionsColl.insertMany(docs)
}
exports.insertManyRewardConditions = insertManyRewardConditions

async function rewardConditionsForCashbackReward(db, cashbackReward) {
    const rewardConditionsColl = db.collection("cashback_reward_conditions")
    const resultsCur = await rewardConditionsColl.find({
        cashback_reward_id: cashbackReward.id
    })
    const results = await resultsCur.toArray()
    const rewardConditions = results.map(RewardCondition.fromDoc)
    return rewardConditions
}
exports.rewardConditionsForCashbackReward = rewardConditionsForCashbackReward

async function findRewardConditionFromLocation(db, locationName, zipCode) {
    const rewardConditionsColl = db.collection("cashback_reward_conditions")
    const resultsCur = await rewardConditionsColl.find({
        $or: [
            { location_name: locationName },
            { location_name: locationName, location_zip_code: zipCode }
        ]
    })
    const results = await resultsCur.toArray()
    console.log(results)
}
exports.findRewardConditionFromLocation = findRewardConditionFromLocation
