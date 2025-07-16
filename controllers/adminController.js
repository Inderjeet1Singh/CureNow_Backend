import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
// adding doctor

// first we add loginAdmin function

const loginAdmin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "enter all data" });
    }
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASS
    ) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign(email + password, process.env.JWT_SECRET);
    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      about,
      fees,
      degree,
      experience,
      address,
    } = req.body;
    const imageFile = req.file;

    // any thing is missing
    if (
      !name ||
      !email ||
      !speciality ||
      !degree ||
      !password ||
      !experience ||
      !fees ||
      !about ||
      !address
    ) {
      return res.json({ success: false, message: "Fill All Details" });
    }
    // email is valid or not
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter valid email address" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must have minimum 8 characters",
      });
    }
    // let encrypt the password

    const salt = await bcrypt.genSalt(10);
    const encryptPass = await bcrypt.hash(password, salt);

    // upload the image on cloudinary
    const imageUplaod = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUplaod.secure_url;
    // store the data in the database
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: encryptPass,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
    };

    const newDoc = new doctorModel(doctorData);
    await newDoc.save();
    return res.json({ success: true, message: "Doctor Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
// let get all doctor list
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// lets fetch all appointment

const allAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// cancel appointments
const AdmincancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);
    if (!doctorData) {
      return res.json({ success: false, message: "Doctor Not found" });
    }
    let slots_booked = doctorData.slots_booked || {};

    slots_booked[slotDate] = (slots_booked[slotDate] || []).filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// dashboard data
const dashboardData = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const data = {
      NumberOfDoc: doctors.length,
      NumberOfUser: users.length,
      NumberOfappointments: appointments.length,
      latestAppointmenst: appointments.reverse().slice(0, 5),
      activeAppointments: appointments.filter((appoint) => !appoint.cancelled)
        .length,
    };
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export {
  addDoctor,
  loginAdmin,
  allDoctors,
  allAppointments,
  AdmincancelAppointment,
  dashboardData,
};
