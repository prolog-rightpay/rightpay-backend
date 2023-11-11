const crypto = require("crypto")

/**
 * Sign-in session.
 */
class Session {
    /** @type {string} Session token, is the identifier. */
    token = null
    /** @type {string} Account ID of the session's owner. */
    accountId = null
    /** @type {date} Date the session was created. */
    dateCreated = null

    /** @type {number} Age of the session in seconds. Default is 2 years. */
    age = null

    /** @type {string?} IP address that created the session. */
    ipAddress = null
    /** @type {string?} Creation source, `api`, etc. */
    creationSource = null

    /**
     * Call `await generateToken()` after initialization.
     * @param {string} token If not provided will generate new one.
     * @param {string} accountId 
     * @param {string} ipAddress 
     * @param {string} creationSource `api`
     * @param {date?} dateCreated If not provided will use initialization date.
     * @param {number?} age Age of the session in seconds. Default is 2 years.
     */
    constructor(accountId, ipAddress, creationSource, dateCreated = null, age=60*60*24*31*12*2) {
        this.accountId = accountId
        this.ipAddress = ipAddress
        this.creationSource = creationSource
        this.dateCreated = dateCreated || new Date()
        this.age = age
    }

    /**
     * Generate a secure token.
     * @returns {Promise<string>} Secure token string.
     */
    generateToken() {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(24, (err, buffer) => {
                if (err) { reject(err) }
                else {
                    this.token = buffer.toString("hex")
                    resolve()
                }
            })
        })
    }

    /**
     * Determine the date the session expires based on date created and age.
     */
    getDateExpires() {
        const date = new Date()
        date.setSeconds(date.getSeconds() + this.age)
        return date
    }

    /**
     * Determine if the current session is active based on date.
     */
    isActive() {
        return this.getDateExpires() > new Date()
    }
}
exports.Session = Session
