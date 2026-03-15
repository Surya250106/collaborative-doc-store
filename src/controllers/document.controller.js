const { getDB } = require("../config/db");
const slugify = require("slugify");
const Diff = require("diff");

/**
 * POST /api/documents
 * Create new document
 */
exports.createDocument = async (req, res) => {
  try {
    const db = getDB();

    const { title, content, tags, authorName, authorEmail } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const doc = {
      slug,
      title,
      content,
      version: 1,
      tags: tags || [],
      metadata: {
        author: {
          id: null,
          name: authorName,
          email: authorEmail,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: content.split(/\s+/).length,
      },
      revision_history: [],
    };

    await db.collection("documents").insertOne(doc);

    return res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create document" });
  }
};

/**
 * GET /api/documents/:slug
 * Retrieve document by slug
 * Includes lazy schema migration
 */
exports.getDocument = async (req, res) => {
  try {
    const db = getDB();

    const doc = await db
      .collection("documents")
      .findOne({ slug: req.params.slug });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    /**
     * Lazy schema migration
     * Convert string author -> object
     */
    if (typeof doc.metadata.author === "string") {
      doc.metadata.author = {
        id: null,
        name: doc.metadata.author,
        email: null,
      };
    }

    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve document" });
  }
};

/**
 * PUT /api/documents/:slug
 * Update document using Optimistic Concurrency Control
 */
exports.updateDocument = async (req, res) => {
  try {
    const db = getDB();

    const slug = req.params.slug;
    const { title, content, version } = req.body;

    const collection = db.collection("documents");

    const existing = await collection.findOne({ slug });

    if (!existing) {
      return res.status(404).json({ message: "Document not found" });
    }

    /**
     * Create content diff
     */
    const diff = Diff.createPatch(
      "content",
      existing.content,
      content
    );

    const result = await collection.findOneAndUpdate(
      { slug, version },
      {
        $set: {
          title,
          content,
          "metadata.updatedAt": new Date(),
          "metadata.wordCount": content.split(/\s+/).length,
        },
        $inc: { version: 1 },
        $push: {
          revision_history: {
            $each: [
              {
                version: version + 1,
                updatedAt: new Date(),
                authorId: existing.metadata?.author?.id || null,
                contentDiff: diff,
              },
            ],
            $slice: -20,
          },
        },
      },
      { returnDocument: "after" }
    );

    /**
     * OCC Conflict Handling
     */
    if (!result.value) {
      const latest = await collection.findOne({ slug });

      return res.status(409).json(latest);
    }

    res.status(200).json(result.value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update document" });
  }
};

/**
 * DELETE /api/documents/:slug
 */
exports.deleteDocument = async (req, res) => {
  try {
    const db = getDB();

    const result = await db
      .collection("documents")
      .deleteOne({ slug: req.params.slug });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};