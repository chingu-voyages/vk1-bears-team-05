import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { profileModel } from "./profile.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";


const profileController = {};

// Add profile
profileController.add = async (req, res, next) => {
  //
  const { photo, userAbout, bloodType, location, lastTimeDonated } = req.body;

  try {
    const profile = await profileModel.create({
      userId: req.user.userId,
      photo,
      userAbout,
      bloodType,
      location,
      lastTimeDonated
    });

    await profile.save();

    res.json(profile);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};


// Get All profile
profileController.findAll = async (req, res) => {
  try {
    const user = req.user.userId;
    let profiles = await profileModel.find({ userId: user }).populate("userId");
    return res.json(profiles);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get profile By ID
profileController.findOne = async (req, res) => {
  try {
    let profile = await profileModel.findById(req.params.profileId);
    if (!profile) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "profile not found" });
    }
    return res.json(profile);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Update profile By ID
profileController.update = async (req, res) => {
  try {
    let profile = await profileModel.findById(req.params.profileId);
    if (!profile) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "profile not found" });
    }
    Object.assign(profile, req.body);
    await profile.save();
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// Delete profile By ID
profileController.delete = async (req, res) => {
  try {
    let profile = await profileModel.findByIdAndRemove(req.params.profileId);
    if (!profile) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "profile not found" });
    }
    return res.json({ message: "profile Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export default profileController;
