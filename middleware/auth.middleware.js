import apiResponse from "../utils/apiresponse.js";
import User from "../model/user.model.js";
import { verifyToken } from "../utils/jwtToken.utils.js";
import { safeUser } from "../utils/createSafeUser.js";
const checkTokenMiddleware = async (req, res, next) => {
  let token = req.headers.Authorization || req.cookies.token;
  if (!token) {
    return res.json(
      new apiResponse(
        400,
        {},
        "Token not found in cookies or Authorization header. Please login !!"
      )
    );
  }
  token = token.replace("Bearer ", "");
  const _id = await verifyToken(token);
  if (!_id) {
    return res.status(400).json(new apiResponse(400, {}, "Invalid token!"));
  }
  let user = await User.findById(_id);
  if (!user) {
    return res.json(new apiResponse(400, {}, "User not found"));
  }
  user = await safeUser(user);
  req.userId = _id;
  req.user = user;
  next();
};

export { checkTokenMiddleware };
