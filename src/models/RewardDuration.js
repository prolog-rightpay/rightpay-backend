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

    static fromDoc(doc) {
        const { type, expiration_date: expirationDate, period_days: periodDays } = doc
        const duration = new RewardDuration()
        switch (type) {
            case "date":
                duration.setExpirationDate(expirationDate)
                break
            case "period":
                duration.setPeriodDays(periodDays)
                break
            default:
                throw new Error("Cashback reward duration has an invalid type")
        }
        return duration
    }
}
exports.RewardDuration = RewardDuration
