import apiResponse from "../utils/apiresponse.js";
import Book from "../model/book.model.js";
import Borrower from "../model/borrower.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { nanoid } from "nanoid";
import Return from "../model/return.model.js";
import dateDifference from "../utils/dateDifference.js";
import calculateFine from "../utils/calculateFine.js";
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



const findBorrowTransaction = async (req, res) => {
  try {
    const borrowTransaction = await Borrower.findOne({
      transactionToken: req.body.transactionToken,
    })
      .populate("userId")
      .populate("bookId");
    if (!borrowTransaction) {
      return res.json(new apiResponse(404, {}, "Transaction not found"));
    }
    return res.json(
      new apiResponse(200, borrowTransaction, "Transaction Found !!")
    );
  } catch (error) {
    console.log(error);
    return res.json(new apiResponse(500, error, "Internal Server Error"));
  }
};

const borrowBook = async (req, res) => {
  try {
    const ISBN = req.params.ISBN;
    const book = await Book.findOne({ ISBN });

    if (!book) {
      return res.json(
        new apiResponse(404, {}, `Book with ISBN:${ISBN} is not found`)
      );
    }

    const alreadyPurchased = await Borrower.findOne({
      bookId: book._id,
      userId: req.userId,
      notReturned: true,
    });

    if (alreadyPurchased) {
      return res.json(
        new apiResponse(
          400,
          { transactionToken: alreadyPurchased.transactionToken },
          `Book with ISBN:${ISBN} is already issued to this user.`
        )
      );
    }

    if (book.quantity === 0) {
      return res.json(
        new apiResponse(400, {}, `Book with ISBN:${ISBN} is out of stock.`)
      );
    }

    const borrower = await Borrower.create({
      bookId: book._id,
      userId: req.userId,
      transactionToken: nanoid(9),
    });

    const updatedBook = await Book.findOneAndUpdate(
      { ISBN },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    if (!updatedBook) {
      await Borrower.findByIdAndDelete(borrower._id);
      return res.json(new apiResponse(500, {}, "Error updating book quantity"));
    }

    return res.json(
      new apiResponse(
        200,
        { transactionToken: borrower.transactionToken },
        "Book is borrowed!"
      )
    );
  } catch (error) {
    console.error(error);
    return res.json(new apiResponse(500, {}, "Internal Server Error"));
  }
};

const returnBook = async (req, res) => {
  try {
    const userId = req.userId;
    const bookId = req.params.bookId;
    const borrowedBooks = await Borrower.find({ userId, bookId });

    if (!borrowedBooks || borrowedBooks.length === 0) {
      return res.json(
        new apiResponse(
          404,
          {},
          "Book not found to return for the specified user and ISBN"
        )
      );
    }

    const sortedBorrowedBooks = borrowedBooks
      .filter((entry) => entry.notReturned)
      .sort((a, b) => b.issuedDate - a.issuedDate);

    if (sortedBorrowedBooks.length === 0) {
      return res.json(
        new apiResponse(400, {}, "Book is already returned or not borrowed")
      );
    }

    const borrowedBook = sortedBorrowedBooks[0];

    borrowedBook.notReturned = false;
    await borrowedBook.save();

    const returnedEntry = await Return.create({
      bookId,
      userId,
      transactionToken: borrowedBook.transactionToken,
    });

    delete returnedEntry.bookId;
    delete returnedEntry.userId;

    const numberOfDaysBorrowed = await dateDifference(
      returnedEntry.issuedDate,
      borrowedBook.issuedDate
    );

    const fineAmount = await calculateFine(numberOfDaysBorrowed, 30, 2);

    return res.json(
      new apiResponse(
        200,
        { transactionToken: returnedEntry.transactionToken, fineAmount },
        "Success"
      )
    );
  } catch (error) {
    console.error(error);
    return res.json(new apiResponse(500, error.message, "Server error!!"));
  }
};



export { addBook, showAllBook, borrowBook, findBorrowTransaction, returnBook };
