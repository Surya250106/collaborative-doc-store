/**
 * Document Model
 * Defines helper methods for working with the documents collection
 */

const { getDB } = require("../config/db");

const COLLECTION_NAME = "documents";

/**
 * Get collection instance
 */
function getCollection() {
  const db = getDB();
  return db.collection(COLLECTION_NAME);
}

/**
 * Validate document payload before insert/update
 */
function validateDocumentPayload(data) {
  if (!data.title || typeof data.title !== "string") {
    throw new Error("Title is required");
  }

  if (!data.content || typeof data.content !== "string") {
    throw new Error("Content is required");
  }

  if (!Array.isArray(data.tags)) {
    throw new Error("Tags must be an array");
  }
}

/**
 * Create document
 */
async function createDocument(doc) {
  const collection = getCollection();

  const result = await collection.insertOne(doc);

  return result;
}

/**
 * Find document by slug
 */
async function findBySlug(slug) {
  const collection = getCollection();

  return await collection.findOne({ slug });
}

/**
 * Delete document
 */
async function deleteBySlug(slug) {
  const collection = getCollection();

  return await collection.deleteOne({ slug });
}

/**
 * Update with OCC
 */
async function updateWithVersion(slug, version, updateData) {
  const collection = getCollection();

  return await collection.findOneAndUpdate(
    { slug, version },
    updateData,
    { returnDocument: "after" }
  );
}

module.exports = {
  getCollection,
  validateDocumentPayload,
  createDocument,
  findBySlug,
  deleteBySlug,
  updateWithVersion
};