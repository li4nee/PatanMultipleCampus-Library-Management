import apiResponse from "../utils/apiresponse.js";
import Book from "../model/book.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

const showAllBook = async (req, res) => {
  const books = await Book.find({});
  return res.json(new apiResponse(200, books, "All the books are obtained"));
};

const addBook = async (req, res) => {
  const { bookname, author, ISBN, genres, publisher } = req.body;
  try {
    let book = await Book.findOneAndUpdate(
      { ISBN },
      { $inc: { quantity: 1 } },
      { new: true }
    );
    if (!book) {
      book = await Book.create({
        bookname,
        author,
        ISBN,
        genres,
        publisher,
        coverImage: req.file?.path || " ",
        quantity: 1,
      });
    }

    res.json(new apiResponse(200, book, "Book created successfully"));
  } catch (error) {
    console.error(error);
    res.json(new apiResponse(500, {}, "Internal server error."));
  }
};

export { addBook, showAllBook };
