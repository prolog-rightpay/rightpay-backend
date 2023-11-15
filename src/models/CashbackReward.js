const { v4: uuidv4 } = require("uuid")

/**
 * Cashback rewards tied to generic payment methods.
 */
class CashbackReward {
    /** @type {string} Internal ID. */
    id = null
    /** @type {Date} Internal date that the reward was added to the database. */
    dateCreated = null
    /** @type {Date?} Internal date that the reward was last modified in the database. */
    dateModified = null

    /** @type {string} Is reward approved and visible to users. */
    isApproved = false
    /** @type {string?} Account ID of the author of the reward. */
    authorAccountId = null
    /** @type {string?} Account ID of the approver. */
    approverAccountId = null

    /** @type {string} **Set with `setTypePercentage()` or `setTypeReimburse()`.** Can be `percentage` / `reimburse` */
    type = null
    /** @type {number?} Minimum spending amount to trigger reward. */
    spendingMin = null
    /** @type {number?} Maximum spending amount of reward. */
    spendingMax = null
    /** @type {string} When the spending min and max caps reset, `annually` / `quarterly` / `monthly` / `daily` / `cycle`. */
    spendingCycle = null

    /** @type {float?} Cashback percentage. */
    percentage = null
    /** @type {number?} Cashback currency amount. */
    reimburseAmount = null

    /** @type {boolean?} Is manual enrollment of reward necessary to apply. */
    isEnrollmentRequired = null
    /** @type {boolean?} Is the reward an introductory offer. */
    isIntroductoryOffer = null

    /** @type {[RewardCondition]} List of conditions, only one has to apply in order to activate reward. Exists to allow for multiple categories, or a category and a specific store. */
    conditions = []
    /** @type {[RewardDuration]} List of durations, which ever is closet applies. Closest expiration should apply. See `RewardDuration` documentation. */
    durations = []

    // is_approved: isApproved, author_account_id: authorAccountId, approver_account_id: approverAccountId

    /**
     * @param {string?} id If not given will create new UUIDv4.
     * @param {boolean} isEnrollmentRequired 
     * @param {boolean} isIntroductoryOffer 
     * @param {date} dateCreated If not given will use date of initialization.
     * @param {date} dateModified 
     * @param {boolean} isApproved
     * @param {string} authorAccountId
     * @param {string} approverAccountId
     */
    constructor(id,
        isEnrollmentRequired,
        isIntroductoryOffer,
        dateCreated = null,
        dateModified = null,
        isApproved = null,
        authorAccountId = null,
        approverAccountId = null) {
            this.id = id || uuidv4()
            this.isEnrollmentRequired = isEnrollmentRequired
            this.isIntroductoryOffer = isIntroductoryOffer
            this.dateCreated = dateCreated || new Date()
            this.dateModified = dateModified
            this.isApproved = isApproved
            this.authorAccountId = authorAccountId
            this.approverAccountId = approverAccountId
        }

    /**
     * @param {boolean} isApproved Is the reward approved?
     * @param {string} authorAccountId 
     * @param {string} approverAccountId 
     */
    setApprovalStatus(isApproved, authorAccountId, approverAccountId) {
        this.isApproved = isApproved
        this.authorAccountId = authorAccountId
        this.approverAccountId = approverAccountId
    }

    /**
     * Set the reward type to be a percentage based cashback, i.e. get 1% back on all purchases.
     * @param {number} percentage Float percentage value from 0 to 1.
     * @param {number?} spendingMin Minimum spending for reward to apply in relevant currency.
     * @param {number?} spendingMax Maximum spending for reward to stop in relevant currency.
     * @param {string?} spendingCycle When the spending min and max caps reset, `annually` / `quarterly` / `monthly` / `daily` / `cycle`.
     */
    setTypePercentage(percentage, spendingMin = null, spendingMax = null, spendingCycle = null) {
        this.type = "percentage"
        this.percentage = percentage
        this.spendingMin = spendingMin
        this.spendingMax = spendingMax
        this.spendingCycle = spendingCycle
    }

    /**
     * Set the reward type to be a reimburse based cashback, i.e. get $500 back after spending $2500.
     * @param {number} reimburseAmount Cash total of reimburse amount.
     * @param {number?} spendingMin Minimum spending for reward to apply in relevant currency.
     * @param {number?} spendingMax Maximum spending for reward to stop in relevant currency.
     * @param {string?} spendingCycle When the spending min and max caps reset, `annually` / `quarterly` / `monthly` / `daily` / `cycle`.
     */
    setTypeReimburse(reimburseAmount, spendingMin = null, spendingMax = null, spendingCycle = null) {
        this.type = "reimburse"
        this.reimburseAmount = reimburseAmount
        this.spendingMin = spendingMin
        this.spendingMax = spendingMax
        this.spendingCycle = spendingCycle
    }

    addDuration(duration) {
        this.durations.push(duration)
    }

    addCondition(condition) {
        this.conditions.push(condition)
    }
}
exports.CashbackReward = CashbackReward

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
