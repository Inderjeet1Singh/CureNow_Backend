import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// lets make middleware for doctor auth

const authDoctor = (req, res, next) => {
  const { dtoken } = req.headers;

  if (!dtoken) {
    return res.json({ success: false, message: "Login Require" });
  }
  try {
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.docId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
