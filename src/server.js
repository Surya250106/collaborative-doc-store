require("dotenv").config();

const express = require("express");

const { connectDB } = require("./config/db");

const seedData = require("./seed/seedData");

const documentRoutes = require("./routes/documents.routes");
const searchRoutes = require("./routes/search.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const { errorHandler, notFound } = require("./middleware/error.middleware");

const app = express();

/**
 * Middleware
 */

app.use(express.json());


/**
 * Health Check Route
 */

app.get("/", (req, res) => {
  res.json({
    message: "Collaborative Document Store API running"
  });
});


/**
 * API Routes
 */

app.use("/api/documents", documentRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/analytics", analyticsRoutes);


/**
 * 404 Handler
 */

app.use(notFound);


/**
 * Global Error Handler
 */

app.use(errorHandler);


/**
 * Start Server
 */

async function startServer() {

  try {

    /**
     * Connect MongoDB
     */

    await connectDB();


    /**
     * Seed Database
     */

    await seedData();


    /**
     * Start Express Server
     */

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("Server failed to start:", error);

    process.exit(1);
  }
}

startServer();