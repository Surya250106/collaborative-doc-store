const { getDB } = require("../config/db")

/**
 * Seed database with initial documents
 * Runs only if collection is empty
 */

async function seedData() {

  const db = getDB()

  const collection = db.collection("documents")

  const existingCount = await collection.countDocuments()

  if (existingCount > 0) {
    console.log("Database already seeded")
    return
  }

  console.log("Seeding database...")

  const docs = []

  for (let i = 0; i < 10000; i++) {

    const useOldSchema = Math.random() < 0.1

    const document = {

      slug: `document-${i}`,

      title: `Sample Document ${i}`,

      content: `This document explains MongoDB usage, backend API design, and database scalability. Example index ${i}.`,

      version: 1,

      tags: ["mongodb", "guide", "api"],

      metadata: {

        author: useOldSchema
          ? "Legacy Author"
          : {
              id: `user-${i}`,
              name: `Author ${i}`,
              email: `author${i}@example.com`
            },

        createdAt: new Date(),

        updatedAt: new Date(),

        wordCount: 120
      },

      revision_history: []
    }

    docs.push(document)
  }

  await collection.insertMany(docs)

  /**
   * Create required indexes
   */

  await collection.createIndex(
    { slug: 1 },
    { unique: true }
  )

  await collection.createIndex(
    { title: "text", content: "text" }
  )

  console.log("Database seeded with 10,000 documents")
}

module.exports = seedData