import express from "express";
import { userRoutes } from "../../module/user/user.routes";
// import { habitRoutes } from "../../module/habit/habit.routes";
// import { goalRoutes } from "../../module/goal/goal.routes";
// import { visionBoardRoutes } from "../../module/visionBoard/visionBoard.routes";
// import { goalCheckRoutes } from "../../module/goalCheck/goalCheck.routes";
// import { categoryRoutes } from "../../module/category/category.routes";

const apiRoutes = express.Router();

apiRoutes.get("/", function(req, res, next) {
  res.json({ message: "BloodMatchAPI" });
});

apiRoutes.use("/auth", userRoutes);
// apiRoutes.use("/habit", habitRoutes);
// apiRoutes.use("/goal", goalRoutes);
// apiRoutes.use("/visionBoard", visionBoardRoutes);
// apiRoutes.use("/goalCheck", goalCheckRoutes);
// apiRoutes.use("/category", categoryRoutes);

export default apiRoutes;
