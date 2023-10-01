const crypto = require("crypto")

const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")

const { Account } = require("../models/account")

const bcryptSaltRounds = 10

async function newAccount(db, account) {
    const accountsColl = db.collection("accounts")

    const existing = await accountsColl.findOne({ email: account.email })
    if (existing != null) {
        return {
            success: false,
            error: "email_exists"
        }
    }

    const userId = uuidv4()
    const dateCreated = new Date()
    const hashedPassword = await bcrypt.hash(account.password, bcryptSaltRounds)
    await accountsColl.insertOne({
        id: userId,
        email: account.email,
        password: hashedPassword,
        first_name: account.firstName,
        last_name: account.lastName,
        date_created: dateCreated
    })
    return {
        success: true
    }
}
exports.newAccount = newAccount

function accountFromBSON(bson) {
    const account = new Account(bson.id, bson.email)
    account.firstName = bson.first_name
    account.lastName = bson.last_name
    account.dateCreated = bson.date_created
    return account
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
 * Generate a secure token.
 * @returns {Promise<string>} Secure token string.
 */
function generateToken() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(48, (err, buffer) => {
            if (err) { reject(err) }
            else { resolve(buffer.toString("hex")) }
        })
    })
}

/**
 * Add a new session token to the database for a user.
 * @param {*} db MongoDB accounts database object.
 * @param {string} id User ID.
 * @param {string?} ipAddress IP address source of the session token creation request.
 * @param {string?} source Identifier that determines why the session token was created.
 */
async function newSessionToken(db, id, ipAddress = null, source = null) {
    const accountSessionsColl = db.collection("account_sessions")
    
    const dateCreated = new Date()
    const sessionToken = await generateToken()
    await accountSessionsColl.insertOne({
        user_id: id,
        session_token: sessionToken,
        date_created: dateCreated,
        ip_address: ipAddress,
        creation_source: source
    })
    return sessionToken
}
exports.newSessionToken = newSessionToken
