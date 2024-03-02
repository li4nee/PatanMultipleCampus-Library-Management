import mongoose from "mongoose";

const BookSchema = mongoose.Schema(
  {
    bookname: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    ISBN: {
      type: Number,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    publication: {
      type: String,
    },
    coverImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);
export default Book;
