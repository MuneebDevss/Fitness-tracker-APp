const router = require("express").Router();
const {
  createResistance,
  getResistanceById,
  deleteResistance,
} = require("../../controllers/resistance-controller");

const {
  createCardio,
  getCardioById,
  deleteCardio,
} = require("../../controllers/cardio-controller");

// /api/exercise/cardio
router.post("/cardio", createCardio);

// /api/exercise/cardio/:id
router.get("/cardio/:id", getCardioById).delete("/cardio/:id", deleteCardio);

// /api/exercise/resistance
router.post("/resistance", createResistance);

// /api/exercise/resistance/:id
router.get("/resistance/:id", getResistanceById).delete("/resistance/:id", deleteResistance);

module.exports = router;
