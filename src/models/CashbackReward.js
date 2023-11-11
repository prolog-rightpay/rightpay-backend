/**
 * Cashback rewards tied to generic credit cards.
 */
class CashbackReward {
    /** @type {string} Internal ID. */
    id = null
    /** @type {Date} Internal date that the reward was added to the database. */
    dateCreated = null
    /** @type {Date?} Internal date that the reward was last modified in the database. */
    dateModified = null

    /** @type {string?} ID of admin that created/approved the reward. */
    adminAuthorId = null
    /** @type {string?} ID of user that originally submitted the reward, if any. */
    userAuthorId = null

    /** @type {string} **Set with `setTypePercentage()` or `setTypeReimburse()`.** Can be `percentage` / `reimburse` */
    type = null
    /** @type {number?} Minimum spending amount to trigger reward. */
    spendingMin = null
    /** @type {number?} Maximum spending amount of reward. */
    spendingMax = null

    /** @type {float?} Cashback percentage. */
    percentage = null
    /** @type {number?} Cashback currency amount. */
    reimburseAmount = null

    /** @type {boolean?} Is manual enrollment of reward necessary to apply. */
    enrollmentRequired = null
    /** @type {boolean?} Is the reward an introductory offer. */
    introductoryOffer = null

    /** @type {[RewardCondition]} List of conditions, only one has to apply in order to activate reward. Exists to allow for multiple categories, or a category and a specific store. */
    conditions = []
    /** @type {[RewardDuration]} List of expirations, which ever is closet applies. Closest expiration should apply. See `RewardDuration` documentation. */
    expiration = []

    /**
     * Set the reward type to be a percentage based cashback, i.e. get 1% back on all purchases.
     * @param {number} percentage Float percentage value from 0 to 1.
     * @param {number} spendingMin Minimum spending for reward to apply in relevant currency.
     * @param {number} spendingMax Maximum spending for reward to stop in relevant currency.
     * @param {string} spendingCycle When the spending min and max caps reset, `annually` / `quarterly` / `monthly` / `daily` / `cycle`.
     */
    setTypePercentage(percentage, spendingMin = null, spendingMax = null, spendingCycle = null) {
        this.type = "percentage"
        this.spendingMin = spendingMin
        this.spendingMax = spendingMax
        this.spendingCycle = spendingCycle
    }

    /**
     * Set the reward type to be a reimburse based cashback, i.e. get $500 back after spending $2500.
     * @param {number} spendingMin Minimum spending for reward to apply in relevant currency.
     * @param {number} spendingMax Maximum spending for reward to stop in relevant currency.
     * @param {string} spendingCycle When the spending min and max caps reset, `annually` / `quarterly` / `monthly` / `daily` / `cycle`.
     */
    setTypeReimburse(spendingMin = null, spendingMax = null, spendingCycle = null) {
        this.type = "reimburse"
        this.spendingMin = spendingMin
        this.spendingMax = spendingMax
        this.spendingCycle = spendingCycle
    }

    addExpirationDate(date) {
        const expiration = {
            type: "date",
            date: date
        }
        this.expiration.push(expiration)
    }

    addExpirationIntroductory(days) {
        const expiration = {
            type: "introductory",
            days: days
        }
        this.expiration.push(expiration)
    }
}

class RewardCondition {
    type = null

    locationCategory = null

    locationName = null
    locationZipCode = null

    /**
     * Add a location category as a condition for the reward.
     * @param {string} category Code for the category. TODO: list of codes
     * @param {[string]?} nameExclusions List of stores to be excluded, e.g. all `grocery_store` while excluding `target` and `walmart`.
     */
    addLocationCategory(category, nameExclusions = []) {
        const condition = {
            type: "location_category",
            location_category: category,
            location_name_exclusions: nameExclusions
        }
        this.conditions.push(conditions)
    }

    /**
     * Add a location as a condition for the reward.
     * @param {string} name Name title of the store. Should match the name in the map location database.
     * @param {string?} zipCode Optional zip code to only exclude a single location.
     */
    addLocation(name, zipCode = null) {
        const condition = {
            type: "location_name",
            location_name: name,
            location_zip: zipCode
        }
        this.conditions.push(condition)
    }
}

// cashback = {
//     id: "uuidv4",
//     credit_card_id: "american-express-plat-card",
//     date_created: "ISO DATE",
//     date_modified: "ISO DATE",

//     type: "percentage", // or reimburse
//     percentage: 0.05,
//     spending_min: null,
//     spending_max: 5000,
//     spending_cycle: "annually",
//     enrollment_required: false,
//     introductory_offer: false,

//     // only one condition has to be met
//     conditions: [{
//         type: "location_category",
//         location_category: "grocery stores",
//         location_name_exclusions: ["Target"]
//     }, {
//         type: "location_name",
//         location_name: "Target"
//     }],

//     // which ever offer comes first
//     expiration: [
//         {
//             type: "date",
//             date: "ISO DATE"
//         },
//         {
//             type: "introductory",
//             days: "DAYS"
//         }
//     ]
// }
