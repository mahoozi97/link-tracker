const router = require("express").Router();
const validator = require("validator");
const Link = require("../models/link-model");
const Analytics = require("../models/analytic-model");
const { requireAuth } = require("../middleware/authentication");

const { customAlphabet } = require("nanoid");
const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const nanoidShort = customAlphabet(alphabet, 8);

const todayDate = require("../utils/today-date");

router.get("/", requireAuth, async (req, res) => {
  const userId = req.session.user._id;
  try {
    console.log("user id :", userId);
    if (!userId) {
      return res.send("User not found");
    }
    const links = await Link.find({ userId }).sort({ _id: -1 });
    console.log("✅ Fetched links successfully");
    res.render("links-list.ejs", { links });
  } catch (error) {
    console.log("✅ Error to fetch the links:", error);
    res.send("Failed to fetch links");
  }
});

router.post("/create", requireAuth, async (req, res) => {
  const userId = req.session.user;
  console.log(userId._id);
  try {
    let shortUrl;
    let exist;

    do {
      shortUrl = nanoidShort();
      exist = await Link.findOne({ shortUrl });
    } while (exist);

    let mainUrl = req.body.mainUrl;
    if (!mainUrl.startsWith("http://") && !mainUrl.startsWith("https://")) {
      mainUrl = "https://" + mainUrl;
    }

    const validUrl = validator.isURL(mainUrl, {
      protocols: ["http", "https"],
      require_protocol: true,
      require_tld: true, // .com ....
    });

    if (!validUrl) {
      return res.send(
        "Please enter a valid website address (e.g., https://www.example.com).",
      );
    }
    const newLink = await Link.create({
      mainUrl: mainUrl,
      shortUrl: shortUrl,
      userId: userId._id,
    });
    console.log("✅ new Link:", newLink);
    res.redirect("/links");
  } catch (error) {
    console.log("❌ Error to create link:", error);
    res.send("Failed to create link");
  }
});

//✅ Done // Redirect to main URL & update click count (shared url).
router.get("/:shorturl", async (req, res) => {
  try {
    const shortUrl = req.params.shorturl;
    if (!shortUrl) {
      return res.send("Link not found or invalid");
    }
    const url = await Link.findOne({ shortUrl: shortUrl });
    url.clicks++;
    await url.save();
    console.log(shortUrl, url);

    //  - - ANALYTICS - -
    const today = todayDate();
    const filter = { linkId: url._id, clickDate: today };
    const ClicksCount = { $inc: { clicksCount: 1 } };
    let doc = await Analytics.findOneAndUpdate(filter, ClicksCount, {
      new: true,
      upsert: true, // create the day's record if it doesn't exist
    });

    res.redirect(url.mainUrl);
  } catch (error) {
    console.log("❌ Error to redirect to the main URL:", error);
    res.send("Failed to redirect to the main URL");
  }
});

// render edit link page
router.get("/edit/:shortUrl", requireAuth, async (req, res) => {
  try {
    const { shortUrl } = req.params;
    console.log(shortUrl);
    if (!shortUrl) {
      return res.send("Short URL not found");
    }
    const link = await Link.findOne({ shortUrl });
    res.render("link-edit.ejs", { link });
  } catch (error) {
    console.log("❌ Error - link not found:", error);
    res.send("Failed - link not found");
  }
});

// edit link details
router.put("/edit/:shortUrl", requireAuth, async (req, res) => {
  try {
    const { shortUrl } = req.params;

    let mainUrl = req.body.mainUrl;
    if (!mainUrl.startsWith("http://") && !mainUrl.startsWith("https://")) {
      mainUrl = "https://" + mainUrl;
    }

    const validUrl = validator.isURL(mainUrl, {
      protocols: ["http", "https"],
      require_protocol: true,
      require_tld: true, // .com ....
    });

    if (!validUrl) {
      return res.send(
        "Please enter a valid website address (e.g., https://www.example.com).",
      );
    }

    const updatedLink = await Link.findOneAndUpdate(
      { shortUrl: shortUrl },
      { mainUrl: mainUrl },
      { new: true },
    );
    console.log("✅ Updated link successfully", updatedLink);
    res.redirect("/links");
  } catch (error) {
    console.log("❌ Error to update link:", error);
    res.send("Failed to update link");
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.send("Link not found");
    }
    const deletedLink = await Link.findByIdAndDelete(id);
    const deletedData = await Analytics.deleteMany({linkId: deletedLink._id})
    console.log("✅ Link deleted successfully:", deletedLink, "Data: ", deletedData);
    res.redirect("/links");
  } catch (error) {
    console.error("❌ Error to delete link:", error);
    res.send({ message: "Failed to delete the link" });
  }
});

// Fetch Analytics data
router.get("/:linkId/details", requireAuth, async (req, res) => {
  const linkId = req.params.linkId;
  try {
    const linkData = await Analytics.find({ linkId: linkId })
      .sort({ clicksCount: -1 })
      .populate("linkId");
    console.log(linkData);

    if (!linkData || linkData.length === 0) {
      return res.send("No click data available for this period.");
    }

    console.log("✅ Details fetched successfully", linkData);
    const shortUrl = linkData[0].linkId.shortUrl;
    const mainUrl = linkData[0].linkId.mainUrl;
    // const totalClicks = linkData[0].linkId.clicks;
    let totalClicks = linkData.reduce(
      (accumulator, clicks) => accumulator + clicks.clicksCount,
      0,
    );
    const dailyAverage = (totalClicks / linkData.length).toFixed(1);
    console.log(totalClicks, linkData.length, dailyAverage);
    res.render("link-details.ejs", {
      linkData,
      shortUrl,
      mainUrl,
      totalClicks,
      dailyAverage,
      linkId,
    });
  } catch (error) {
    console.log("❌ Error to fetch details:", error);
    res.send("Failed to fetch details");
  }
});

module.exports = router;
