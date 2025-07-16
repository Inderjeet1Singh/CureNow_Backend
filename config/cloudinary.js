import { v2 as cloudinary } from "cloudinary";
const connectCloudinary = async () => {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary connected");
  } catch (error) {
    console.log("error in cloudinary connection", error);
  }
};

export default connectCloudinary;
