import express from "express";
import requestPostController from "./requestPost.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";

const requestPostRoutes = express.Router();

// add a requestPost
requestPostRoutes.post(
  "/",
  [authenticateToken],
  asyncWrapper(requestPostController.add)
);

// view all 
requestPostRoutes.get(
  "/", [authenticateToken], 
  asyncWrapper(requestPostController.findAll));


// view one requestPost
requestPostRoutes.get(
  "/:requestPostId",
  [authenticateToken],
  asyncWrapper(requestPostController.findOne)
);

// update a requestPost
requestPostRoutes.put(
  "/:requestPostId",
  [authenticateToken],
  asyncWrapper(requestPostController.update)
);

// delete a requestPost
requestPostRoutes.delete(
  "/:requestPostId",
  [authenticateToken,isAdmin],
  asyncWrapper(requestPostController.delete)
);

export { requestPostRoutes };
