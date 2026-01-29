const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  otpCode: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.username) {
    this.username = this.username.toLowerCase();
  }

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified("otpCode") && this.otpCode) {
    this.otpCode = await bcrypt.hash(this.otpCode, 10);
  }
});

userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.username) {
    update.username = update.username.toLowerCase();
  }

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
