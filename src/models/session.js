class Session {
    accountId = null
    token = null
    dateCreated = null
    ipAddress = null
    creationSource = null

    constructor(token, accountId) {
        this.token = token
        this.accountId = accountId
    }
}
exports.Session = Session
