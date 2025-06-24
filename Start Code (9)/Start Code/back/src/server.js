import express, { json } from "express";
import cors from "cors";
import articleRouter from "./routes/articleRoutes.js";
import journalistRouter from "./routes/journalistRoutes.js";
import { pool } from "./utils/database.js";

const app = express();


// Enable CORS for all routes and origins
app.use(cors());

// Enable json serialization
app.use(json());

app.use("/api/articles", articleRouter);
app.use("/api/journalists", journalistRouter);

const PORT = 8080;

// Add a database connection test before starting the server
pool.query("SELECT 1")
  .then(() => {
    console.log("Database connection successful.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });