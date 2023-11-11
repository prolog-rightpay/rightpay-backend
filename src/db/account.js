const bcrypt = require("bcrypt")

const { Account } = require("../models/Account")
const { Session } = require("../models/Session")

const bcryptSaltRounds = 10

async function newAccount(db, account, password) {
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
        date_created: account.dateCreated
    })
    return {
        success: true
    }
}
exports.newAccount = newAccount

function accountFromBSON(bson) {
    const { id, email,
        first_name: firstName, last_name: lastName,
        date_created: dateCreated} = bson
    const account = new Account(id, email, firstName, lastName, dateCreated)
    return account
}

function sessionFromBSON(bson) {
    const { token, account_id: accountId,
        date_created: dateCreated, age,
        ip_address: ipAddress, creation_source: creationSource } = bson

    const session = new Session(accountId, ipAddress, creationSource, dateCreated, age)
    session.token = token
    return session
}

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
        const account = accountFromBSON(existing)
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
async function newSession(db, session) {
    const accountSessionsColl = db.collection("account_sessions")
    await accountSessionsColl.insertOne({
        token: session.token,
        account_id: session.accountId,
        date_created: session.dateCreated,
        age: session.age,
        ip_address: session.ipAddress,
        creation_source: session.creationSource
    })
}
exports.newSession = newSession

async function validateSessionToken(db, sessionToken) {
    const accountSessionsColl = db.collection("account_sessions")
    const sessionBSON = await accountSessionsColl.findOne({ token: sessionToken })
    if (!sessionBSON || !sessionBSON.account_id) {
        return null
    }
    const session = sessionFromBSON(sessionBSON)
    if (!session.isActive()) {
        return null
    }

    const accountsColl = db.collection("accounts")
    const accountBSON = await accountsColl.findOne({ id: session.accountId })
    if (!accountBSON) {
        return null
    }
    const account = accountFromBSON(accountBSON)
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
            valid: false,
            date_invalidated: new Date()
        }
    }
    await accountSessionsColl.updateOne({ session_token: sessionToken }, docUpdate, { upsert: false })
}
exports.invalidateSessionToken = invalidateSessionToken
