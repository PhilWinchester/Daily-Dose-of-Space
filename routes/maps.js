const router = require("express").Router();

router.get("/", (req,res) => {
  res.render("index");
});
router.get("/cluster", (req,res) => {
  res.render("./mapDemos/mapCluster.ejs");
});
router.get("/data", (req,res) => {
  res.render("./mapDemos/mapData.ejs");
});
router.get("/firebase", (req,res) => {
  res.render("./mapDemos/mapFirebase.ejs");
});
router.get("/marker", (req,res) => {
  res.render("./mapDemos/mapMarker.ejs");
});
router.get("/location", (req,res) => {
  res.render("mapDemos/mapsCurrLoc");
});
router.get("/visual", (req,res) => {
  res.render("./mapDemos/mapVisual.ejs");
});

module.exports = router;
