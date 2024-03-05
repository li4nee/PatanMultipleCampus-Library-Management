import mongoose from "mongoose";

const fineSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fineAmountForBook: {
        type: [{
          bookId: {
            type: mongoose.Types.ObjectId,
            ref: 'Book',
            required: true,
          },
          fineAmount: {
            type: Number,
            default: 0,
          },
        }],
        default: [],
    },
    finePayedAt:{
        type: [{
            bookId: {
              type: mongoose.Types.ObjectId,
              ref: 'Book',
              required: true,
            },
            fineAmount: {
              type: Number,
              default: 0,
            },
            date:{
                type:String,
                default: () => new Date().toISOString(),
            }
          }],
          default: [],
    }
  },
  { timestamps: true }
);

const Fine = mongoose.model("Return", fineSchema);
export default Fine;