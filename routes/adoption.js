const express = require("express");
const adoptionController = require("../controllers/adoptionController");

const router = express.Router();

//get all media
router.get("/all", adoptionController.getAll);

router.get("/get/:id", adoptionController.getOne );

//post create new media
router.post("/create", adoptionController.create);

//update
router.put("/update/:id", adoptionController.update);

//delete
router.delete("/delete/:id", adoptionController.delete);


module.exports = router;