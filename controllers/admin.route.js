const router = require("express").Router();
const Link = require("../models/link-model");
const User = require("../models/user-model");
const Analytics = require("../models/analytic-model");
const bcrypt = require("bcrypt");
const todayDate = require("../utils/today-date");

// const now = new Date();
// const filterDate = new Date(
//   Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
// );

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

    const username = links[0].userId.username;
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
      return res.redirect(userPage);
    } else if (redirectTo === "analytics") {
      res.redirect("/admin/dashboard/analytics");
    } else {
      return res.redirect("/admin/dashboard/links");
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
      { new: true },
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

//  - - - - - - - - - - - - - ANALYTICS - - - - - - - - - - -

router.get("/dashboard/analytics", async (req, res) => {
  const filterDate = todayDate();
  filterDate.setDate(filterDate.getDate() - 30);
  try {
    const analyticsData = await Analytics.aggregate([
      { $match: { clickDate: { $gte: filterDate } } },
      {
        $group: {
          _id: "$linkId",
          totalClicks: { $sum: "$clicksCount" },
          avgClickPerDay: { $avg: "$clicksCount" },
        },
      },
      {
        $lookup: {
          from: "links",
          localField: "_id",
          foreignField: "_id",
          as: "linkInfo",
        },
      },
      { $unwind: "$linkInfo" },
      { $sort: { totalClicks: -1 } },
      // { $limit: 5 },
    ]);
    console.log("✅ Analytics data:", analyticsData);
    res.render("admin/analytics.ejs", { analyticsData });
  } catch (error) {
    console.log("❌ Error to fetch analytics data:", error);
    res.send("Failed to fetch analytics data ");
  }
});

// analytics per link
router.get("/dashboard/analytics/:linkId", async (req, res) => {
  const linkId = req.params.linkId;
  try {
    const linkData = await Analytics.find({ linkId: linkId })
      .sort({ clicksCount: -1 })
      .populate({
        path: "linkId",
        populate: {
          // nested populate
          path: "userId",
          model: "User",
          select: "-password -email",
        },
      });
    console.log(linkData);

    if (!linkData || linkData.length === 0) {
      return res.send("No click data available for this period.");
    }

    console.log("✅ Details fetched successfully", linkData);
    const shortUrl = linkData[0].linkId.shortUrl;
    const mainUrl = linkData[0].linkId.mainUrl;
    const createdBy = linkData[0].linkId.userId.username;
    const userId = linkData[0].linkId.userId._id;
    const totalClicks = linkData[0].linkId.clicks;
    let totalClicksCount = linkData.reduce(
      (accumulator, clicks) => accumulator + clicks.clicksCount,
      0,
    );
    const dailyAverage = totalClicksCount / linkData.length;
    console.log(totalClicksCount, linkData.length, dailyAverage);
    res.render("admin/details.ejs", {
      linkData,
      shortUrl,
      mainUrl,
      totalClicks,
      dailyAverage,
      linkId,
      createdBy,
      userId,
    });
  } catch (error) {
    console.log("❌ Error to fetch details:", error);
    res.send("Failed to fetch details");
  }
});

module.exports = router;
