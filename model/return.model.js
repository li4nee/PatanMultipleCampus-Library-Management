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
    transactionToken:{
      type:String,
      required:true
    },
    issuedDate: {
      type: String,
      default: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })
    }
  },
  { timestamps: true }
);

const Return = mongoose.model("Return", returnSchema);
export default Return;