const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceController = require("../controllers/sauce");

router.post("/", auth, multer, sauceController.createSauce);
router.get("/", auth, sauceController.getAllSauce);
router.get("/:id", auth, sauceController.getSauce);
router.put("/:id", auth, multer, sauceController.modifySauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.likeSauce);

module.exports = router;
