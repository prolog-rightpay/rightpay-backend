class CreditCard {
    id = null
    dateCreated = null
    dateModified = null
    name = null

    adminAuthorId = null
    userAuthorId = null

    issuer = {
        name: null,
        country: "usa",
        currency: "usd",
        network: null
    }
    cashbackPromotions = []
}

// card = {
//     id: "american-express-plat-card",
//     date_created: "ISO DATE",
//     date_modified: "ISO DATE",
//     name: "American Express Platinum Card",
//     card: {
//         issuer: "American Express",
//         country: "usa",
//         network: "american_express"
//     }
// }
