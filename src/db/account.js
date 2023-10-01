const bcrypt = require("bcrypt")

const bcryptSaltRounds = 10
/**
 * Promise wrap around `bcrypt.hash`.
 * @param {string} plainTextPassword Plain text password to hash.
 * @param {int} saltRounds Number of salt rounds.
 * @returns {Promise<string>} Hashed password
 */
function bcryptHash(plainTextPassword, saltRounds = bcryptSaltRounds) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
            if (err) { reject(err) }
            else { resolve(hash) }
        })
    })
}

async function newAccount(db, account) {
    const accountsColl = db.collection("accounts")

    const existing = await accountsColl.findOne({ email: account.email })
    if (existing != null) {
        return {
            success: false,
            error: "email_exists"
        }
    }

    const hashedPassword = await bcryptHash(account.password)
    await accountsColl.insertOne({
        email: account.email,
        password: hashedPassword
    })
    return {
        success: true
    }
}
exports.newAccount = newAccount
