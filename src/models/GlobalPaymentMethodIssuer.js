class GlobalPaymentMethodIssuer {
    id = null
    name = null
    bin = null
    imageUrl = null

    constructor(id, name, bin, imageUrl = null) {
        this.id = id
        this.name = name
        this.bin = bin
        this.imageUrl = imageUrl
    }
}
exports.GlobalPaymentMethodIssuer = GlobalPaymentMethodIssuer
