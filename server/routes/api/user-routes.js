const router = require("express").Router();
const { createUser, login, getSingleUser,getSingleTrainer,getCurrentUser,getTrainers,followTrainer } = require("../../controllers/user-controller");

// /api/user for user signup
router.post("/", createUser);

// /api/user/login for user login
router.get("/getCurrent", getCurrentUser);
router.get("/getTrainers", getTrainers);
router.post("/followTrainer", followTrainer);
router.post("/login", login);
// /api/user/me to get single user data (without authentication middleware)
router.get("/me", getSingleUser);
router.get("/Trainer", getSingleTrainer);
module.exports = router;
