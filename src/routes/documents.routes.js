const express = require("express");

const router = express.Router();

const {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument
} = require("../controllers/document.controller");


/**
 * POST /api/documents
 * Create a new document
 */
router.post("/", createDocument);


/**
 * GET /api/documents/:slug
 * Retrieve document by slug
 */
router.get("/:slug", getDocument);


/**
 * PUT /api/documents/:slug
 * Update document with Optimistic Concurrency Control
 */
router.put("/:slug", updateDocument);


/**
 * DELETE /api/documents/:slug
 */
router.delete("/:slug", deleteDocument);


module.exports = router;