import mongoose from "mongoose";

const borrowerSchema = mongoose.Schema(
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
    },
    notReturned:{
        type:Boolean,
        default:true
    }
  },
  { timestamps: true }
);

const Borrower = mongoose.model("Borrower", borrowerSchema);
export default Borrower;
