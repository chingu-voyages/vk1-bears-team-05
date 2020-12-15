import express from "express";
import profileController from "./profile.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";

const profileRoutes = express.Router();

// add a profile
profileRoutes.post(
  "/",
  [authenticateToken],
  asyncWrapper(profileController.add)
);

// view all 
profileRoutes.get(
  "/", [authenticateToken], 
  asyncWrapper(profileController.findAll));


// view one profile
profileRoutes.get(
  "/:profileId",
  [authenticateToken],
  asyncWrapper(profileController.findOne)
);

// update a profile
profileRoutes.put(
  "/:profileId",
  [authenticateToken],
  asyncWrapper(profileController.update)
);

// delete a profile
profileRoutes.delete(
  "/:profileId",
  [authenticateToken,isAdmin],
  asyncWrapper(profileController.delete)
);

export { profileRoutes };
