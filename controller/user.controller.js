import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import apiResponse from "../utils/apiresponse.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/jwtToken.utils.js";
import { safeUser } from "../utils/createSafeUser.js";
import Borrower from "../model/borrower.model.js";
import Fine from "../model/fine.model.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.json(new apiResponse(400, {}, "Email password error!"));
    }
    const bcryptResponse = await bcrypt.compare(password, user.password);
    if (!bcryptResponse) {
      return res.json(new apiResponse(400, {}, "Email or password error!"));
    }
    let userWithoutPasswordIDToken = await safeUser(user);
    const refreshToken = await createRefreshToken({ _id: user._id });
    const accessToken = await createAccessToken({ _id: user.id });
    let userUpdated = await User.findOneAndUpdate(
      { email },
      { token: accessToken },
      { new: true }
    );
    res.cookie("token", accessToken, {
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
    });
    delete userWithoutPasswordIDToken.email;
    res.json(
      new apiResponse(
        200,
        { user: userWithoutPasswordIDToken, token: accessToken },
        "User Logged In"
      )
    );
  } catch (error) {
    res.json(new apiResponse(500, error, "Internal server error"));
  }
};

const signupUser = async (req, res) => {
  try {
    let { email, password, name, faculty } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.json(new apiResponse(400, {}, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email,
      password: hashedPassword,
      name,
      faculty,
    });
    user = await safeUser(user);
    delete user.email;
    if (user) {
      return res.json(new apiResponse(200, user, "User created sucessfully"));
    } else {
      return res.json(new apiResponse(500, {}, "Internal server error"));
    }
  } catch (error) {
    return res.json(new apiResponse(400, error, "Error"));
  }
};

const logoutUser = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {

      token = req.cookies.token;
    }

    if (!token) {
      return res.json(new apiResponse(400, {}, "No token provided"));
    }

    res.clearCookie("token");


    const newAccessToken = await createAccessToken({ _id: req.userId });

    const user = await User.findOneAndUpdate(
      { token },
      { token: newAccessToken },
      { new: true }
    );

    if (!user) {
      return res.json(new apiResponse(404, {}, "User not found"));
    }

    return res.json(
      new apiResponse(
        200,
        { user: safeUser(user) },
        "User Logged Out"
      )
    );
  } catch (error) {
    console.error(error);
    return res.json(new apiResponse(500, error, "Internal server error"));
  }
};

const showUserProfile = async (req, res) => {
  try {
    let transactions = await Borrower.find({ userId: req.userId }).populate(
      "bookId"
    );
    let dueTransactions = transactions.filter((element) => element.notReturned);
    return res.json(
      new apiResponse(200, { user: req.user, dueTransactions }, "User Profile")
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(new apiResponse(500, error, "Server Error!!"));
  }
};

const seeTransactionDetail = async (req, res) => {
  try {
    const borrowTransaction = await Borrower.findOne({
      transactionToken: req.params.transactionToken,
    });

    if(transactionToken.userId!=req.userId)
    {
      return res.json(new apiResponse(400, {}, "Not authorized to see this transaction detail"));
    }

    if (!borrowTransaction) {
      return res.json(new apiResponse(404, {}, "Transaction not found"));
    }

    const bookId = borrowTransaction.bookId;

    const fine = await Fine.findOne({
      userId: borrowTransaction.userId,
      bookId: bookId,
    });

    let fineDetails = {
      fineAmount:  fine.fineAmount, 
      duePayment:  fine.duePayment ,
    };

    return res.json(
      new apiResponse(200, { borrowTransaction, fineDetails }, "Transaction Found !!")
    );
  } catch (error) {
    console.log(error);
    return res.json(new apiResponse(500, error, "Internal Server Error"));
  }
};

const seeTransactionHistory=async(req,res)=>{
  let transactions = await Borrower.find({ userId: req.userId }).populate(
    "bookId"
  );
  return res.json(
    new apiResponse(200, { transactions }, "Success !!")
  );
}

export {
  loginUser,
  signupUser,
  logoutUser,
  showUserProfile,
  seeTransactionDetail,
  seeTransactionHistory
};
