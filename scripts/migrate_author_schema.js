require("dotenv").config();

const { MongoClient } = require("mongodb");

const BATCH_SIZE = 1000;

async function migrateAuthorSchema() {

  const client = new MongoClient(process.env.MONGO_URI);

  try {

    console.log("Connecting to MongoDB...");

    await client.connect();

    const db = client.db(process.env.DATABASE_NAME);

    const collection = db.collection("documents");

    console.log("Connected to database:", process.env.DATABASE_NAME);

    const cursor = collection.find({
      "metadata.author": { $type: "string" }
    });

    let batch = [];
    let processed = 0;

    while (await cursor.hasNext()) {

      const doc = await cursor.next();

      batch.push({
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: {
              "metadata.author": {
                id: null,
                name: doc.metadata.author,
                email: null
              }
            }
          }
        }
      });

      if (batch.length === BATCH_SIZE) {

        const result = await collection.bulkWrite(batch);

        processed += result.modifiedCount;

        console.log(`Processed ${processed} documents`);

        batch = [];
      }
    }

    if (batch.length > 0) {

      const result = await collection.bulkWrite(batch);

      processed += result.modifiedCount;
    }

    console.log("Migration completed successfully.");
    console.log(`Total documents migrated: ${processed}`);

  } catch (error) {

    console.error("Migration failed:", error);

  } finally {

    await client.close();

    console.log("MongoDB connection closed.");
  }
}

migrateAuthorSchema();