import apiResponse from "../utils/apiresponse.js";

const checkRole = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== "ADMIN") {
      return res.status(403).json(
        new apiResponse(403, {}, "Unauthorized access: Admin role required.")
      );
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new apiResponse(500, error, "Internal server error")
    );
  }
};

export { checkRole };

