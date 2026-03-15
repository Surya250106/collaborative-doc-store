const { MongoClient } = require("mongodb")

let client
let database

/**
 * Connect to MongoDB
 */
async function connectDB() {

  try {

    client = new MongoClient(process.env.MONGO_URI)

    await client.connect()

    database = client.db(process.env.DATABASE_NAME)

    console.log("✅ MongoDB connected successfully")

  } catch (error) {

    console.error("❌ MongoDB connection failed:", error)

    process.exit(1)
  }
}


/**
 * Get DB instance
 */
function getDB() {

  if (!database) {

    throw new Error("Database not initialized. Call connectDB first.")

  }

  return database
}


/**
 * Close DB connection
 */
async function closeDB() {

  if (client) {

    await client.close()

    console.log("MongoDB connection closed")

  }

}

module.exports = {
  connectDB,
  getDB,
  closeDB
}