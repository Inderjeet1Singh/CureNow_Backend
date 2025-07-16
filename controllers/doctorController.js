import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availabilty Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// login doctor
const LoginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "Fill all details" });
    }
    const isDoctor = await doctorModel.findOne({ email });
    if (isDoctor) {
      const isMatch = await bcrypt.compare(password, isDoctor.password);
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid Crendentials" });
      }
      const token = jwt.sign({ id: isDoctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Crendentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// all appointments of doctor
const allAppointments = async (req, res) => {
  try {
    const docId = req.docId;
    const appoinments = await appointmentModel.find({ docId });
    res.json({ success: true, appoinments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// mark appointment complete
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
    const { appoinmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appoinmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appoinmentId, {
        isCompleted: true,
      });
      res.json({ success: true, message: "Appointment Comleted" });
    } else {
      res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// cancel Appointment
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId;
    const { appoinmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appoinmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appoinmentId, {
        cancelled: true,
      });
      res.json({ success: true, message: "Appointment Cancel" });
    } else {
      res.json({
        success: false,
        message: " Appointment Cancel Failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// dashboard data
const dashboardData = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });
    let earning = 0;
    let patient = [];
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
      if (!patient.includes(item.userId)) {
        patient.push(item.userId);
      }
    });

    const Dashdata = {
      earning,
      appointments: appointments.length,
      numberOfPatient: patient.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, Dashdata });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// doctor profile
const getDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const docProfileData = await doctorModel
      .findById(docId)
      .select("-password");

    res.json({ success: true, docProfileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// doctor profile updation
const updateDocProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { name, experience, fees, address, available, about } = req.body;

    await doctorModel.findByIdAndUpdate(docId, {
      name,
      experience,
      fees,
      address,
      available,
      about,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  LoginDoctor,
  allAppointments,
  appointmentComplete,
  appointmentCancel,
  dashboardData,
  getDoctorProfile,
  updateDocProfile,
};
