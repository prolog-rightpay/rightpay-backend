const { v4: uuidv4 } = require("uuid")

/** Condition that must apply for reward. */
class RewardCondition {
    /** @type {string} UUIDv4 ID of the reward condition. Useful for database. */
    id = null
    /** @type {string} Type reward, `location_category` or `location`. */
    type = null

    /** @type {string} Location category, applicable when of type `location_category`.  */
    locationCategory = null
    /** @type {[string]} Specific business names to exclude from category, applicable when of type `location`. */
    nameExclusions = null

    /** @type {string} Name of location, application when of type `location`. */
    locationName = null
    /** @type {string} ZIP code of location, applicable when of type `location`. */
    locationZipCode = null

    /**
     * Once initialized use `setLocationCategory` or `setLocation`.
     * @param {string} id If not given will create new UUIDv4.
     */
    constructor(id) {
        id = uuidv4()
    }

    /**
     * Configures the reward to be conditional on a location category (e.g. grocery store).
     * @param {string} category Location category as recognized keyword (TODO).
     * @param {[string]} nameExclusions Specific name exclusions from the category (e.g. exclude Walmart from all grocery stores).
     */
    setLocationCategory(category, nameExclusions) {
        this.type = "location_category"
        this.locationCategory = category
        this.nameExclusions = nameExclusions
    }

    /**
     * Configures the reward to be conditional on a specific named location.
     * @param {string} name Name of the business.
     * @param {string} zipCode Specific ZIP code of the business. Not including will exclude all businesses with a similar name.
     */
    setLocation(name, zipCode = null) {
        this.type = "location"
        this.name = name
        this.zipCode = zipCode
    }
}
exports.RewardCondition = RewardCondition
