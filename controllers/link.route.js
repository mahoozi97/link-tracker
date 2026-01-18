const router = require("express").Router();
const Link = require("../models/link-model");
const { requireAuth } = require("../middleware/authentication");

const { customAlphabet } = require("nanoid");
const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const nanoidShort = customAlphabet(alphabet, 8);

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

    const mainUrl = req.body.mainUrl;
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
    const updatedLink = await Link.findOneAndUpdate(
      { shortUrl: shortUrl },
      req.body,
      { new: true }
    );
    console.log("✅ Updated link successfully");
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
    console.log("✅ Link deleted successfully:", deletedLink);
    res.redirect("/links");
  } catch (error) {
    console.error("❌ Error to delete link:", error);
    res.send({ message: "Failed to delete the link" });
  }
});

module.exports = router;
