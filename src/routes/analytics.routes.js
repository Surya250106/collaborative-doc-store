const express = require("express");

const router = express.Router();

const {
  mostEdited,
  tagCoOccurrence
} = require("../controllers/analytics.controller");


/**
 * GET /api/analytics/most-edited
 */
router.get("/most-edited", mostEdited);


/**
 * GET /api/analytics/tag-cooccurrence
 */
router.get("/tag-cooccurrence", tagCoOccurrence);


module.exports = router;