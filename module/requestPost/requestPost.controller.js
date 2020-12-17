import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requestPostModel } from "./requestPost.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const requestPostController = {};

// Add requestPost
requestPostController.add = async (req, res, next) => {
  //
  const {title, story, photo, bloodType, amount, location, phoneNumber, closingDate, hospital, status, referenceNumber} = req.body;

  try {
    const requestPost = await requestPostModel.create({
      userId: req.user.userId,
      title, 
      story, 
      photo, 
      bloodType, 
      amount, 
      location, 
      phoneNumber, 
      closingDate, 
      hospital, 
      status, 
      referenceNumber
    });

    await requestPost.save();

    res.json(requestPost);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get All requestPost
requestPostController.findAll = async (req, res) => {
  try {
    const user = req.user.userId;
    let requestPosts = await requestPostModel.find({ userId: user }).populate("user");
    return res.json(requestPosts);
  } catch (error) {

    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });

  }
};

// Get requestPost By ID
requestPostController.findOne = async (req, res) => {
  try {
    let requestPost = await requestPostModel.findById(req.params.requestPostId);
    if (!requestPost) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "requestPost not found" });
    }
    return res.json(requestPost);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Update requestPost By ID
requestPostController.update = async (req, res) => {
  try {
    let requestPost = await requestPostModel.findById(req.params.requestPostId);
    if (!requestPost) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "requestPost not found" });
    }
    Object.assign(requestPost, req.body);
    await requestPost.save();
    return res.json(requestPost);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// Delete requestPost By ID
requestPostController.delete = async (req, res) => {
  try {
    let requestPost = await requestPostModel.findByIdAndRemove(req.params.requestPostId);
    if (!requestPost) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "requestPost not found" });
    }
    return res.json({ message: "requestPost Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export default requestPostController;
