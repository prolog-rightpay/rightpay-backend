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
    /** @type {date} Date modified, usually modified on made non-active. */
    dateModified = null

    /** @type {number} Age of the session in seconds. Default is 2 years. */
    age = null

    /** @type {string?} IP address that created the session. */
    ipAddress = null
    /** @type {string?} Creation source, `api`, etc. */
    creationSource = null

    /** @type {boolean} Is session active, true unless invalidated. */
    isActive = null

    /**
     * Call `await generateToken()` after initialization.
     * @param {string} token If not provided will generate new one.
     * @param {string} accountId 
     * @param {string} ipAddress 
     * @param {string} creationSource `api`
     * @param {date?} dateCreated If not provided will use initialization date.
     * @param {number?} age Age of the session in seconds. Default is 2 years.
     * @param {boolean} active Is session active, default `true`.
     */
    constructor(accountId, ipAddress, creationSource, dateCreated = null, dateModified = null, age=60*60*24*31*12*2, active = true) {
        this.accountId = accountId
        this.ipAddress = ipAddress
        this.creationSource = creationSource
        this.dateCreated = dateCreated || new Date()
        this.dateModified = dateModified
        this.age = age
        this.isActive = active
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
    isValid() {
        return this.isActive && this.getDateExpires() > new Date()
    }

    static fromDoc(doc) {
        const { token, account_id: accountId,
            date_created: dateCreated, date_modified: dateModified, age,
            ip_address: ipAddress, creation_source: creationSource,
            is_active: active } = doc

        const session = new Session(accountId, ipAddress, creationSource, dateCreated, dateModified, age, active)
        session.token = token
        return session
    }
}
exports.Session = Session
