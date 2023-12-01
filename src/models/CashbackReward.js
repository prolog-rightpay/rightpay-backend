const { v4: uuidv4 } = require("uuid")
const { RewardDuration } = require("./RewardDuration")

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

    toJson(extended = false) {
        const { id, paymentMethodId, dateCreated, dateModified,
            isApproved, authorAccountId, approverAccountId, type,
            spendingMin, spendingMax, spendingCycle, percentage,
            reimburseAmount, isEnrollmentRequired, isIntroductoryOffer, conditions, durations } = this
    
        const jsonConditions = conditions.map(condition => {
            const { type, locationCategory, locationNameExclusions, locationName, locationZipCode } = condition
            return {
                type: type,
                location_category: locationCategory,
                location_name_exclusions: locationNameExclusions,
                location_name: locationName,
                location_zip_code: locationZipCode
            }
        })
        const jsonDurations = durations.map(duration => {
            const { type, expirationDate, periodDays } = duration
            return {
                type: type,
                expiration_date: expirationDate,
                period_days: periodDays
            }
        })
        const data = {
            id: id,
            payment_method_id: paymentMethodId,
            type: type,
            spending_min: spendingMin,
            spending_max: spendingMax,
            spending_cycle: spendingCycle,
            percentage: percentage,
            reimburse_amount: reimburseAmount,
            is_enrollment_required: isEnrollmentRequired,
            is_introductory_offer: isIntroductoryOffer,
            conditions: jsonConditions,
            durations: jsonDurations
        }
        if (extended) {
            data.date_created = dateCreated
            data.date_modified = dateModified
            data.is_approved = isApproved
            data.author_account_id = authorAccountId
            data.approver_account_id = approverAccountId
        }
        return data
    }

    static fromDoc(doc) {
        const { id, date_created: dateCreated, date_modified: dateModified,
            is_approved: isApproved, author_account_id: authorAccountId, approver_account_id: approverAccountId,
            type, spending_min: spendingMin, spending_max: spendingMax, spending_cycle: spendingCycle, 
            percentage, reimburse_amount: reimburseAmount,
            is_enrollment_required: isEnrollmentRequired, is_introductory_offer: isIntroductoryOffer } = doc
    
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
        cashbackReward.isApproved = isApproved
        cashbackReward.authorAccountId = authorAccountId
        cashbackReward.approverAccountId = approverAccountId
    
        const durations = doc.durations.map(RewardDuration.fromDoc)
        cashbackReward.durations = durations
    
        return cashbackReward
    }
}
exports.CashbackReward = CashbackReward
