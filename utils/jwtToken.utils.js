import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const createAccessToken = async (payload) => {
  const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{ expiresIn: "1h" });
  return token;
};

const verifyToken = async(token)=>
{   try {
  const payload= jwt.verify(token,process.env.JWT_SECRET_KEY);
  return payload;
  
} catch (error) {
  console.log(error);
  return undefined;
}
}

const createRefreshToken = async (payload) => {
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{ expiresIn: "48h" });
    return token;
  };

export {verifyToken,createAccessToken,createRefreshToken};
