import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import apiResponse from "../utils/apiresponse.js";
const loginUser = async (req, res) => {
  console.log(req.body);
  return res.send("ok");
};
const signupUser = async (req, res) => {
    try {
      const { email, password, name, faculty } = req.body;
  
      let user = await User.findOne({ email }).select('+password');
      if (user) {
        return res.json(new apiResponse(400, {}, "User already exists"));
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        email,
        password: hashedPassword,
        name,
        faculty,
      });
  
      // to Object chai mongoose ko document to plain js ko object lagna lai so that we can use spread oprator to copy
      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
      if (user) {
        return res.json(new apiResponse(200, userWithoutPassword, "User created sucessfully"));
      } else {
        return res.json(new apiResponse(500, {}, "Internal server error"));
      }
    } catch (error) {
      return res.json(new apiResponse(400, error, "Error"));
    }
  };
  
const logoutUser = async (req, res) => {
  console.log("ok");
  return res.send("ok");
};
const showUserProfile = async (req, res) => {
  console.log(req.params._id);
  return res.send("ok");
};

export { loginUser, signupUser, logoutUser, showUserProfile };
