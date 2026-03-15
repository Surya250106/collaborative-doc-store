const slugify = require("slugify")

/**
 * Generate URL friendly slug
 * Ensures lowercase and removes special characters
 */

function generateSlug(title) {

  if (!title || typeof title !== "string") {
    throw new Error("Title required for slug generation")
  }

  return slugify(title, {
    lower: true,
    strict: true,
    trim: true
  })

}

module.exports = {
  generateSlug
}