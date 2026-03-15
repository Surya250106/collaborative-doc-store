const express = require("express");

const router = express.Router();

const {
  searchDocuments
} = require("../controllers/search.controller");


/**
 * GET /api/search?q=keyword
 * GET /api/search?q=keyword&tags=tag1,tag2
 */
router.get("/", searchDocuments);


module.exports = router;