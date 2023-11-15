const { RewardCondition } = require("../../../models/RewardCondition")

async function insertRewardCondition(db, rewardCondition, cashbackRewardId) {
    const doc = bsonForRewardCondition(rewardCondition, cashbackRewardId)

    const rewardConditionsColl = db.collection("cashback_reward_conditions")
    await rewardConditionsColl.insertOne(doc)
}
exports.insertRewardCondition = insertRewardCondition

async function insertManyRewardConditions(db, rewardConditions, cashbackRewardId) {
    const docs = rewardConditions.map(condition => bsonForRewardCondition(condition, cashbackRewardId) )
    const rewardConditionsColl = db.collection("cashback_reward_conditions")
    await rewardConditionsColl.insertMany(docs)
}
exports.insertManyRewardConditions = insertManyRewardConditions

function bsonForRewardCondition(rewardCondition, cashbackRewardId) {
    const { id, type, locationCategory, locationNameExclusions, locationName, locationZipCode } = rewardCondition

    const bson = {
        id: id,
        cashback_reward_id: cashbackRewardId,
        type: type,
        location_category: locationCategory,
        location_name_exclusions: locationNameExclusions,
        location_name: locationName,
        location_zip_code: locationZipCode
    }
    return bson
}
exports.bsonForRewardCondition = bsonForRewardCondition

function rewardConditionFromBSON(bson) {
    const { id, type, location_category: locationCategory,
    location_name_exclusions: locationNameExclusions, location_name: locationName, location_zip_code: locationZipCode } = bson

    const condition = new RewardCondition(id)
    if (type == "location_category") {
        condition.setLocationCategory(locationCategory, locationNameExclusions)
    } else if (type == "location") {
        condition.setLocation(locationName, locationZipCode)
    }

    return condition
}

async function findRewardConditionFromLocation(locationName, zipCode) {
    const rewardConditionsColl = db.collection("cashback_reward_conditions")
    const resultsCur = await rewardConditionsColl.find({
        $or: [
            { location_name: locationName },
            { location_name: locationName, location_zip_code: zipCode }
        ]
    })
    const results = await resultsCur.toArray()
    print(results)
}
exports.findRewardConditionFromLocation = findRewardConditionFromLocation
