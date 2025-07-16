import express from "express";
import {
  appointments,
  bookAppointment,
  cancelAppointment,
  getUserProfile,
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/userConroller.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/my-profile", authUser, getUserProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/my-appointment", authUser, appointments);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
export default userRouter;
