import mongoose from "mongoose";

const fineSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    duePayment:{
      type:Boolean,
      default:true
    },
    payedDate: {
      type: String,
    },
  },
  { timestamps: true }
);

const Fine = mongoose.model("Fine", fineSchema);
export default Fine;
