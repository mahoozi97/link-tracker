const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  mainUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Link = mongoose.model("Link", linkSchema);
module.exports = Link;
