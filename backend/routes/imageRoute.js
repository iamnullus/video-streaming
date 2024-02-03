const { Router } = require("express");
const imageController = require("../controllers/imageController.js");

const router = Router();

router.get("/", imageController.getImage);
module.exports = router;
