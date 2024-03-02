import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

const uploadOnCloudinary = async (Path) => {
  try {
    if (!Path) return null;
    const response = await cloudinary.uploader.upload(Path, {
      resource_type: "auto",
    });
    fs.unlink(Path, (Error) => {
      if (Error) {
        console.error("Error deleting local file:", Error);
      }
    });
    return response;
  } catch (error) {
    fs.unlink(Path, (Error) => {
        if (Error) {
          console.error("Error deleting local file:", Error);
        }
      });
    console.log(error);
    return null;
  }
};

export { uploadOnCloudinary };
