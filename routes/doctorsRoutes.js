import express from "express";
import {
  allAppointments,
  appointmentCancel,
  appointmentComplete,
  dashboardData,
  doctorList,
  getDoctorProfile,
  LoginDoctor,
  updateDocProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/doctor-list", doctorList);
doctorRouter.post("/login", LoginDoctor);
doctorRouter.get("/doctor-appointments", authDoctor, allAppointments);
doctorRouter.post("/appointment-complete", authDoctor, appointmentComplete);
doctorRouter.post("/appointment-cancel", authDoctor, appointmentCancel);
doctorRouter.get("/doctor-dashboard", authDoctor, dashboardData);
doctorRouter.get("/doctor-profile", authDoctor, getDoctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDocProfile);
export default doctorRouter;
