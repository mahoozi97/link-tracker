const router = require("express").Router();
const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const { customAlphabet } = require("nanoid");
const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const nanoidOtp = customAlphabet(alphabet, 4);
const { requireAuth } = require("../middleware/authentication");
const sendEmailVerification = require("../utils/mailer");

router.get("/sign-up", (req, res) => {
  res.render("sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  console.log("req body:", username, email);
  try {
    const userFound = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).select("-password");

    if (userFound) {
      if (userFound.username === username) {
        return res.send("Username already taken.");
      }
      if (userFound.email === email) {
        return res.send("Already you have account!");
      }
    }

    const newUser = await User({ ...req.body });
    newUser.otpCode = nanoidOtp();
    newUser.save();
    console.log("✅ Signed up successfully");

    const otp = newUser.otpCode;
    sendEmailVerification(newUser.email, otp);

    res.redirect(`/auth/verification/${newUser._id}`);
  } catch (error) {
    console.log("❌ Error sign up:", error);
    res.send("Failed sign up");
  }
});

router.get("/verification/:userId", (req, res) => {
  const userId = req.params.userId;
  res.render("Verification.ejs", { userId });
});

router.post("/verify", async (req, res) => {
  const { one, two, three, four, userId } = req.body;
  const otpCode = one + two + three + four;
  try {
    const user = await User.findById(userId).select("-password");

    const validOtp = bcrypt.compareSync(otpCode, user.otpCode);

    if (!validOtp) {
      return res.send("The verification code is wrong");
    }
    user.isVerified = true;
    user.otpCode = "";
    user.save();

    // for forgot password case
    if (req.session.action === "forgot-password") {
      req.session.destroy()
      return res.redirect(`/auth/new-password/${userId}`);
    }

    console.log("✅ Email verified successfully");

    req.session.user = {
      username: user.username,
      _id: user._id,
    };

    res.redirect("/links");
  } catch (error) {
    console.log("❌ Error to verification:", error);
    res.send("Failed to verification");
  }
});

// send otp again.
router.get("/send-again/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("user ID:", userId);
  try {
    const user = await User.findById(userId).select("-password");
    user.otpCode = nanoidOtp();
    user.save();
    const otp = user.otpCode;
    sendEmailVerification(user.email, otp);
    console.log("✅ Re send otp successfully");
    res.redirect(`/auth/verification/${userId}`);
  } catch (error) {
    console.log("❌ Error to resend OTP.");
    res.send("Failed to resend OTP. Please try again.");
  }
});

router.get("/login", (req, res) => {
  res.render("sign-in.ejs");
});

// ------- LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.send("Login failed. Please try again.");
    }

    if (!user.isVerified) {
      user.otpCode = nanoidOtp();
      user.save();
      const otp = user.otpCode;
      sendEmailVerification(user.email, otp);
      return res.redirect(`/auth/verification/${user._id}`);
    }

    console.log("✅ Signed in successfully");

    // Save the logged-in user’s basic information in the session to keep them authenticated across requests.
    req.session.user = {
      username: user.username,
      _id: user._id,
      role: user.role,
    };

    console.log(req.session.user);

    return user.role === "admin"
      ? res.redirect("/admin/dashboard")
      : res.redirect("/links");
  } catch (error) {
    console.log("❌ Error sign in:", error);
    res.send("Failed sign in");
  }
});

// render profile page with user data.
router.get("/profile", requireAuth, async (req, res) => {
  const userId = req.session.user._id;
  try {
    if (!userId) {
      return res.send("User not found");
    }
    const user = await User.findById(userId).select("-password");
    console.log("✅ User data fetched successfully", user);

    return user.role === "admin"
      ? res.render("admin/admin-profile.ejs", {
          username: user.username,
          email: user.email,
        })
      : res.render("profile-details.ejs", {
          username: user.username,
          email: user.email,
        });
  } catch (error) {
    console.log("❌ Error to fetch user data:", error);
    res.send("Failed to fetch user data");
  }
});

// sign out
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// edit username
router.put("/edit-username", requireAuth, async (req, res) => {
  const userId = req.session.user._id;
  try {
    if (!userId) {
      return res.send("User not found");
    }
    const username = req.body.username;
    console.log(username);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: username },
      {
        new: true,
      },
    ).select("-password");
    console.log("✅ Username updated successfully:", updatedUser);

    return req.session.user.role === "admin"
      ? res.redirect("/auth/profile")
      : res.redirect("/links");
  } catch (error) {
    console.log("❌ Error to edit username:", error);
    res.send("Failed to edit username");
  }
});

// Edit email
router.put("/edit-email", requireAuth, async (req, res) => {
  const userId = req.session.user._id;
  try {
    if (!userId) {
      return res.send("User not found");
    }

    const email = req.body.email;
    console.log(email);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: email },
      {
        new: true,
      },
    ).select("-password");

    if (req.session.user.role === "admin") {
      return res.redirect("/auth/profile");
    }

    const otpCode = nanoidOtp();
    updatedUser.otpCode = otpCode;
    updatedUser.isVerified = false;
    updatedUser.save();
    sendEmailVerification(updatedUser.email, otpCode);
    console.log("✅ Email updated successfully:", updatedUser);
    res.redirect(`/auth/verification/${updatedUser._id}`);
  } catch (error) {
    console.log("❌ Error to edit email:", error);
    res.send("Failed to edit email");
  }
});

// reset password
router.put("/reset-password", requireAuth, async (req, res) => {
  // const { username } = req.params;
  const userId = req.session.user._id;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  try {
    if (!userId) {
      return res.send("User not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.send("User not found");
    }

    const validPassword = bcrypt.compareSync(currentPassword, user.password);

    if (!validPassword) {
      return res.send("Reset password failed. Please try again.");
    }

    const password = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: password },
      { new: true },
    );
    console.log("✅ reset password successfully:");
    req.session.destroy(); // sign out
    res.redirect("/auth/login");
  } catch (error) {
    console.log("❌ Error to reset password:", error);
    res.send("Failed to reset password");
  }
});

//  - - - - - - - - - - - - - FORGOT PASSWORD - - - - - - - - - - - - - -

router.get("/forgot-password-verification", (req, res) => {
  res.render("forgot-password.ejs");
});

// /auth/forgot-password-verification
router.post("/forgot-password-verification", async (req, res) => {
  const email = req.body.email;
  try {
    const foundUser = await User.findOne({ email: email }).select("-password");

    if (!foundUser) {
      return res.send("The email is wrong!!");
    }

    console.log("foundUser:", foundUser);
    foundUser.otpCode = nanoidOtp();
    foundUser.isVerified = false;
    foundUser.save();
    const otp = foundUser.otpCode;
    sendEmailVerification(foundUser.email, otp);
    req.session.action = "forgot-password";
    res.redirect(`/auth/verification/${foundUser._id}`);
  } catch (error) {
    console.log("❌ Error to verifying email:", error);
    res.send("Failed to verifying email");
  }
});

router.get("/new-password/:userId", async (req, res) => {
  res.render("reset-password.ejs", { userId: req.params.userId });
});

// set a new password after forgot it.
router.put("/new-password", async (req, res) => {
  const { newPassword, userId } = req.body;

  try {
    const password = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        password: password,
      },
      { new: true },
    );
    console.log("✅ Reset forgotten password successfully ");
    res.redirect("/auth/login");
  } catch (error) {
    console.log("❌ Error to reset forgotten password successfully :", error);
    res.send("Failed to set your new password!");
  }
});

module.exports = router;
