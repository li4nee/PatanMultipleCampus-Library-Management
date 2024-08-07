import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
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
      select: false
    } ,
    faculty: {
      type: String,
      enum: ["Science", "Management", "Humanities", "Arts"],
      required:true
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      default: "STUDENT",
      enum: ["STUDENT", "ADMIN"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
