const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")

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

async function checkPassword(db, email) {
    const accountsColl = db.collection("accounts")

    const existing = await accountsColl.findOne({ email: account.email })
    if (existing != null) {
        return {
            success: false,
            error: "no_account"
        }
    }

    // compare the bcrypt hash
    const validPassword = await bcrypt.compare(existing.password, account.password)
    if (validPassword) {
        return {
            success: true,
        }
    } else {
        return {
            success: false,
            error: "invalid_password"
        }
    }
}

async function newSessionToken(db, email) {
    const accountsColl = db.collection("accounts")
}
