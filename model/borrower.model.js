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
    transactionToken:{
      type:String,
      required:true
    },
    issuedDate: {
      type: String,
      default: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }),
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
