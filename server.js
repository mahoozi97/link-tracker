const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const helmet = require("helmet");
require("dotenv").config();
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const { requireAuth, requireAdminAuth } = require("./middleware/authentication");
const authRoutes = require("./controllers/auth.route");
const linkRoutes = require("./controllers/link.route");
const adminRoutes = require("./controllers/admin.route");
const publicRoutes = require("./controllers/public.route");
const app = express();

// Use Helmet to set secure HTTP headers
app.use(helmet());
// app.use(express.json()); // for parsing application/json //<?>
app.use(express.static("public"));
// Middleware to parse URL-encoded form data from POST requests.
app.use(express.urlencoded({ extended: false })); //<?>
app.use(methodOverride("_method")); // Use the query parameter '_method'
app.use(morgan("dev"));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1h
    },
  }),
);

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log("❌ MongoDB connection failed: ", error);
  }
};
connectToDB();

app.use("/auth", authRoutes);

app.use("/links", requireAuth, linkRoutes);

app.use("/admin", requireAdminAuth, adminRoutes);

app.use("/", publicRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});
