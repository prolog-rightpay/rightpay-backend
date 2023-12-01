const bcrypt = require("bcrypt")

const { Account } = require("../models/Account")
const { Session } = require("../models/Session")

const bcryptSaltRounds = 10

async function insertAccount(db, account, password) {
    const accountsColl = db.collection("accounts")

    const existing = await accountsColl.findOne({ email: account.email })
    if (existing != null) {
        return {
            success: false,
            error: "email_exists"
        }
    }

    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds)
    await accountsColl.insertOne({
        id: account.id,
        email: account.email,
        password: hashedPassword,
        first_name: account.firstName,
        last_name: account.lastName,
        date_created: account.dateCreated,
        is_admin: account.isAdmin
    })
    return {
        success: true
    }
}
exports.insertAccount = insertAccount

async function getAccountFromId(db, id) {
    const accountsColl = db.collection("accounts")
    const accountDoc = await accountsColl.findOne({ id: id })
    if (!accountDoc) {
        throw new Error("Account with ID does not exist")
    }
    const account = Account.fromDoc(accountDoc)
    return account
}
exports.getAccountFromId = getAccountFromId

/**
 * Validate a password using the user's ID.
 * @param {*} db MongoDB accounts database object.
 * @param {string} email User email.
 * @param {string} password Raw string password.
 * @returns 
 */
async function validatePassword(db, email, password) {
    const accountsColl = db.collection("accounts")

    const existing = await accountsColl.findOne({ email: email })
    if (!existing) {
        return {
            success: false,
            error: "no_account"
        }
    }

    // compare the bcrypt hash
    const validPassword = await bcrypt.compare(password, existing.password)
    if (validPassword) {
        const account = Account.fromDoc(existing)
        return {
            success: true,
            account: account
        }
    } else {
        return {
            success: false,
            error: "invalid_password"
        }
    }
}
exports.validatePassword = validatePassword

/**
 * Add a new session token to the database for a user.
 * @param {*} db MongoDB accounts database object.
 * @param {string} id User ID.
 * @param {string?} ipAddress IP address source of the session token creation request.
 * @param {string?} source Identifier that determines why the session token was created.
 */
async function insertSession(db, session) {
    const accountSessionsColl = db.collection("account_sessions")
    await accountSessionsColl.insertOne({
        token: session.token,
        account_id: session.accountId,
        date_created: session.dateCreated,
        date_modified: session.dateModified,
        age: session.age,
        ip_address: session.ipAddress,
        creation_source: session.creationSource,
        is_active: session.isActive
    })
}
exports.insertSession = insertSession

async function validateSessionToken(db, sessionToken) {
    const accountSessionsColl = db.collection("account_sessions")
    const sessionDoc = await accountSessionsColl.findOne({ token: sessionToken })
    if (!sessionDoc || !sessionDoc.account_id) {
        return null
    }
    const session = Session.fromDoc(sessionDoc)
    if (!session.isValid()) {
        return null
    }

    const accountsColl = db.collection("accounts")
    const accountDoc = await accountsColl.findOne({ id: session.accountId })
    if (!accountDoc) {
        return null
    }
    const account = Account.fromDoc(accountDoc)
    return {
        session: session,
        account: account
    }
}
exports.validateSessionToken = validateSessionToken

async function invalidateSessionToken(db, sessionToken) {
    const accountSessionsColl = db.collection("account_sessions")
    const docUpdate = {
        $set: {
            is_active: false,
            date_modified: new Date()
        }
    }
    await accountSessionsColl.updateOne({ token: sessionToken }, docUpdate, { upsert: false })
}
exports.invalidateSessionToken = invalidateSessionToken
