import mongoose from "mongoose";

const returnSchema = mongoose.Schema(
  {
    bookId: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issuedDate: {
      type: String,
      default:Date.now()
    }
  },
  { timestamps: true }
);

const Return = mongoose.model("Return", returnSchema);
export default Return;