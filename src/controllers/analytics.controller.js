const { getDB } = require("../config/db");

/**
 * GET /api/analytics/most-edited
 */
exports.mostEdited = async (req, res) => {
  try {
    const db = getDB();

    const result = await db
      .collection("documents")
      .aggregate([
        {
          $project: {
            title: 1,
            slug: 1,
            editCount: { $size: "$revision_history" },
          },
        },
        { $sort: { editCount: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics failed" });
  }
};

/**
 * GET /api/analytics/tag-cooccurrence
 */
exports.tagCoOccurrence = async (req, res) => {
  try {
    const db = getDB();

    const result = await db
      .collection("documents")
      .aggregate([
        { $match: { tags: { $exists: true, $ne: [] } } },

        {
          $project: {
            tags: 1,
          },
        },

        {
          $unwind: "$tags",
        },

        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },

        {
          $sort: { count: -1 },
        },
      ])
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tag analytics failed" });
  }
};