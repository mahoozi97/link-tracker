const mongoose = require("mongoose");

const analyticSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.ObjectId,
    ref: "Link",
    required: true,
  },
  clickDate: {
    type: Date,
    required: true,
  },
  clicksCount: {
    type: Number,
    default: 0,
  },
});

const Analytics = mongoose.model("Analytics", analyticSchema);

module.exports = Analytics
