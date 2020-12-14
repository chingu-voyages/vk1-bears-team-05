import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "./user.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";
import crypto from "crypto-random-string";
import nodemailer from "nodemailer";
const mustache = require("mustache");
const fs = require("fs");
const path = require("path");

const userController = {};

// Create User
userController.register = async (req, res, next) => {
  userModel
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(httpStatus.CONFLICT).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          console.log(hash);
          if (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              error: err,
            });
          } else {
            const activation = crypto({ length: 16, type: "alphanumeric" });

            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "istianreid@gmail.com",
                pass: appConfig.gmail_password,
                // naturally, replace both with your real credentials or an application-specific password
              },
              tls: {
                rejectUnauthorized: false,
              },
            });

            const filePath = path.join(__dirname, "activationemail.html");
            var content = await fs.readFileSync(filePath, "utf-8");
            var view = {
              url: `https://localhost:3000/activate/${activation}`,
              name: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
              },
            };
            var activationEmail = mustache.render(content, view);

            // email activation to user
            const mailOptions = {
              from: "istianreid@gmail.com",
              to: req.body.email,
              subject: "Activate your account",
              html: activationEmail,
            };

            // console.log(activation);
            // console.log(appConfig.gmail_password);
            // console.log(req.body.email);

            transporter.sendMail(mailOptions, async function (err, info) {
              if (err) {
                console.log(err);

                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                  error: err,
                });
              } else {
                console.log(info);

                const newUser = await userModel.create({
                  email: req.body.email,
                  password: hash,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  city: req.body.city,
                  mobileNumber: req.body.mobileNumber,
                  activation_key: activation,
                });

                // let { password, __v, ...user } = newUser.toObject();

                if (newUser) {
                  return res.status(httpStatus.CREATED).json({
                    status: { type: "success", code: httpStatus.OK },
                    message: "Register successful",
                    data: null,
                  });
                } else {
                  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: {
                      type: "error",
                      code: httpStatus.INTERNAL_SERVER_ERROR,
                    },
                    message: "Register failed",
                    data: null,
                  });
                }
              }
            });
          }
        });
      }
    });
};

// Login user
userController.login = async (req, res, next) => {
  userModel
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (user.length < 1) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Auth failed",
        });
      }

      if (!user[0].is_active) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Not yet activated",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(httpStatus.UNAUTHORIZED).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].id,
              mobileNumber: user[0].mobileNumber,
              firstName: user[0].firstName,
              lastName: user[0].lastName,
            },
            appConfig.jwt_key,
            {
              expiresIn: appConfig.jwt_expiration,
            }
          );
          return res.status(httpStatus.OK).json({
            status: { type: "success", code: httpStatus.OK },
            message: "Auth successful",
            data: { token },
          });
        }
        res.status(httpStatus.UNAUTHORIZED).json({
          status: { type: "error", code: httpStatus.UNAUTHORIZED },
          message: "Auth failed",
          data: null,
        });
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: err,
      });
    });
};

userController.activate = async (req, res) => {
  console.log(req.params.activation);

  try {
    const activation = req.params.activation;

    let user = await userModel.findOneAndUpdate(
      {
        activation_key: activation,
      },
      { $set: { is_active: true, activation_key: "" } },
      (err, doc) => {
        if (err) {
          console.log("Activation Error!");
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Activation error" });
        }

        if (!doc) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: {
              type: "error",
              code: httpStatus.BAD_REQUEST,
            },
            message: "Activation key not found",
            data: null,
          });
        }

        return res.status(httpStatus.OK).json({
          status: {
            type: "success",
            code: httpStatus.OK,
          },
          message: "You have successfully activated your account.",
          data: null,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: err,
    });
  }
};

// Get All Users
userController.findAll = async (req, res) => {
  try {
    let users = await userModel.find();
    return res.json(users);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get User By ID
userController.findOne = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.userId);
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Update User By ID
userController.update = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.userId);
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "User not found" });
    }
    Object.assign(user, req.body);
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// Delete User By ID
userController.delete = async (req, res) => {
  try {
    let user = await userModel.findByIdAndRemove(req.params.userId);
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "User not found" });
    }
    return res.json({ message: "User deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export default userController;
