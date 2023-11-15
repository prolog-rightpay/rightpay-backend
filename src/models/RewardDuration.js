class RewardDuration {
    /** @type {string} `date` or `period` */
    type = null

    /** Date that the reward expires. */
    expirationDate = null
    /** Number of days, relative to the user's credit card signup date, that the offer lasts for. */
    periodDays = null

    /** Use `setExpirationDate` or `setPeriod`. */
    constructor() {}

    setExpirationDate(date) {
        this.type = "date"
        this.expirationDate = date
        this.periodDays = null
    }

    setPeriodDays(days) {
        this.type = "period"
        this.periodDays = days

        this.expirationDate = null
    }
}
exports.RewardDuration = RewardDuration
