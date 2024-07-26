const express = require("express");
const {
  create,
  list,
  listEverything,
  read,
  remove,
  update,
  photo,
} = require("../controllers/blog");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/blog", requireSignin, adminMiddleware, create);
router.get("/blog", list);
router.post("/blog/ct", listEverything);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
router.put("/blog/:slug", requireSignin, adminMiddleware, update);
router.get("/blog/photo/:slug", photo);

module.exports = router;
