import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://www.w3schools.com/howto/img_avatar.png",
  },
  gender: {
    type: String,
    default: "Not Selected",
  },
  address: {
    type: Object,
    default: {
      line1: "",
      line2: "",
    },
  },

  dob: {
    type: String,
    default: "Not Selected",
  },
  date: {
    type: String,
    default: () => {
      const now = new Date();
      const d = String(now.getDate()).padStart(2, "0");
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const y = now.getFullYear();
      const h = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");
      return `${d}/${m}/${y}  time: ${h}:${min}`;
    },
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
