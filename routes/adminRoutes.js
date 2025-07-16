import express from "express";
import {
  addDoctor,
  AdmincancelAppointment,
  allAppointments,
  allDoctors,
  dashboardData,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";
const adminRouter = express.Router();
adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availabilty", authAdmin, changeAvailability);
adminRouter.get("/all-appointments", authAdmin, allAppointments);
adminRouter.post("/cancel-appointment", authAdmin, AdmincancelAppointment);
adminRouter.get("/admin-dashboard", authAdmin, dashboardData);
export default adminRouter;
