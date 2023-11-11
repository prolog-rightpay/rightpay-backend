/**
 * Determine the first invalid key of a failed Joi schema validation.
 * @param {object} Joi error object, the `error` attribute of the object returned by `schema.validate()`. 
 * @returns {string|null} Invalid key string or null.
 */
 function determineInvalidKey(error) {
    if (error.details.length < 1) {
        return null
    }
    const context = error.details[0].context.label
    return context
}
exports.determineInvalidKey = determineInvalidKey