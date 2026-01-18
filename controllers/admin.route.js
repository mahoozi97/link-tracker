const router = require("express").Router();
const Link = require("../models/link-model");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

// - - - - - - - - - - - - - - LINKS - - - - - - - - - - - - - - - -

router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard.ejs");
});

// fetch all links for (Admin)
router.get("/dashboard/links", async (req, res) => {
  try {
    const links = await Link.find().sort({ _id: -1 });
    console.log("✅ fetched all links successfully");
    res.render("admin/links.ejs", { links });
  } catch (error) {
    console.log("❌ Error to fetch all links:", error);
    res.send("Failed to fetch all links");
  }
});

// Redirect to main URL
router.get("/:shorturl", async (req, res) => {
  try {
    const shortUrl = req.params.shorturl;
    if (!shortUrl) {
      return res.send("The link not found");
    }
    const url = await Link.findOne({ shortUrl: shortUrl });
    console.log("Redirect short URL:", shortUrl, url);
    res.redirect(url.mainUrl);
  } catch (error) {
    console.log("❌ Error redirect to the main URL:", error);
    res.send("Failed to redirect to the main URL");
  }
});

// fetch links by userId...
router.get("/dashboard/links/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!userId) {
      return res.send("User not found");
    }

    const links = await Link.find({ userId })
      .sort({ _id: -1 })
      .populate("userId", "-password"); // Exclude password fields from populated query data...

    const username = links.map((linke) => {
      return linke.userId.username;
    });

    console.log("✅ links for user fetched successfully", links, username);
    res.render("admin/links-by-user-id.ejs", { links, username });
  } catch (error) {
    console.log("✅ Error to fetch links for user:", error);
    res.send("Failed to fetch links for user");
  }
});

// delete any link created by user...
router.delete("/:linkId", async (req, res) => {
  const linkId = req.params.linkId;
  const redirectTo = req.body.redirectTo;
  try {
    if (!linkId) {
      return res.send("Link not found");
    }
    const deletedLink = await Link.findByIdAndDelete(linkId);
    console.log("✅ Link deleted successfully:", deletedLink);
    const userId = deletedLink.userId._id;
    if (redirectTo === "specific user") {
      const userPage = `/admin/dashboard/links/${userId}`;
      res.redirect(userPage);
    } else {
      res.redirect("/admin/dashboard/links");
    }
  } catch (error) {
    console.error("❌ Error to delete link:", error);
    res.send({ message: "Failed to delete the link" });
  }
});

// - - - - - - - - - - - - - - USERS - - - - - - - - - - - - - - - -

// fetch all users
router.get("/dashboard/users", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 }).select("-password");
    console.log("✅ All users fetched successfully");
    res.render("admin/users.ejs", { users });
  } catch (error) {
    console.log("❌ Error to fetch all users:", error);
    res.send("Failed to fetch all users");
  }
});

// render the page for edit user profile
router.get("/dashboard/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!userId) {
      return res.send("User not found");
    }

    // get user profile without password.
    const user = await User.findById(userId).select("-password");
    console.log("✅ User fetched successfully:", user);
    res.render("admin/edit-user-profile.ejs", { user });
  } catch (error) {
    console.log("❌ Error to fetch user:", error);
    res.send("failed to fetch user");
  }
});

// edit user profile
router.put("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!userId) {
      return res.send("User not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    ).select("-password");
    console.log("✅ User updated successfully", updatedUser);
    res.redirect(`/admin/dashboard/users/${userId}`);
  } catch (error) {
    console.log("❌ Error to update user:", error);
    re.send("Failed to update user");
  }
});

// delete user
router.delete("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const links = await Link.deleteMany({ userId });

    const linksCount = await Link.countDocuments({ userId });
    if (linksCount > 0) {
      return res.send("Links aren't deleted");
    }

    const user = await User.findByIdAndDelete(userId);
    console.log("✅ User deleted successfully");
    res.redirect("/admin/dashboard/users");
  } catch (error) {
    console.log("❌ Error to delete user", error);
    res.send("Failed to delete user");
  }
});

module.exports = router;
