const Diff = require("diff")

/**
 * Generate content diff patch
 */

function generateDiff(oldContent, newContent) {

  if (!oldContent) oldContent = ""
  if (!newContent) newContent = ""

  const patch = Diff.createPatch(
    "content",
    oldContent,
    newContent
  )

  return patch
}

module.exports = {
  generateDiff
}