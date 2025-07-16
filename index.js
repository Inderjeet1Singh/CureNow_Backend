import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";
import doctorRouter from "./routes/doctorsRoutes.js";
import userRouter from "./routes/userRouters.js";
const app = express();
const PORT = process.env.PORT || 3000;
connectDb();
connectCloudinary();
app.use(express.json());
app.use(cors());

// Api end points

app.get("/", (req, res) => {
  res.send("Api working fine");
});
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
