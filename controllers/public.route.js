const router = require("express").Router();
const Link = require("../models/link-model");
const Analytics = require("../models/analytic-model");

const todayDate = require("../utils/today-date");

router.get("/", (req, res) => {
  res.render("home-page.ejs");
});

// Count click and redirect to main URL
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

module.exports = router;
