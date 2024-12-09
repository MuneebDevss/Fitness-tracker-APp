const express = require("express");
const path = require("path");
const routes = require("./routes");
const cors = require("cors");  // Import the cors package
require('dotenv').config();
const db = require("./config/connection");

const PORT = 5000;
const app = express();

// Enable CORS for all routes and allow requests from localhost:3000
app.use(cors({
  origin: "http://localhost:3000", // Allow only requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
  allowedHeaders: ["Content-Type", "Authorization"] // Allow specific headers
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets
app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
