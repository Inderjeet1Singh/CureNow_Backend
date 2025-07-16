import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("Db connected");
  } catch (error) {
    console.log("Db connection Error!");
  }
};

export default connectDb;
