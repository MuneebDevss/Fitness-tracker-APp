const router = require("express").Router();
const userRoutes = require("./user-routes");
const exerciseRoutes = require("./exercise-routes");
const feedBackRoutes = require("../../routes/feedBackRouter");
router.use("/user", userRoutes);
router.use("/feedBack", feedBackRoutes);
router.use("/exercise", exerciseRoutes);

module.exports = router;
