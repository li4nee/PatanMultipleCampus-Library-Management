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
    const book = await Book.create({
      bookname,
      author,
      ISBN,
      genres,
      publisher,
      coverImage: req.file?.path || " ",
    });
    res.json(new apiResponse(200, book, "Book Created Sucessfully"));
  } catch (error) {
    res.json(
      new apiResponse(
        400,
        {},
        "Error adding books."
      )
    );
  }
};
export { addBook,showAllBook };