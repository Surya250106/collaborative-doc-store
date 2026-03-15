const { getDB } = require("../config/db");

/**
 * GET /api/search?q=term&tags=a,b
 */
exports.searchDocuments = async (req, res) => {
  try {
    const db = getDB();

    const { q, tags } = req.query;

    const query = {
      $text: { $search: q },
    };

    /**
     * Tag filtering
     */
    if (tags) {
      const tagArray = tags.split(",");
      query.tags = { $all: tagArray };
    }

    const results = await db
      .collection("documents")
      .find(query, {
        projection: {
          score: { $meta: "textScore" },
          title: 1,
          slug: 1,
          tags: 1,
        },
      })
      .sort({ score: { $meta: "textScore" } })
      .toArray();

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
};