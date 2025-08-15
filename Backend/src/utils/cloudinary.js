import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      use_filename: true,
      unique_filename: false,
      access_mode: "public",
      resource_type: "auto",
    });

    console.log(`file is uploaded on cloudinary: ${response.url}`);
    fs.unlinkSync(localFilePath);
    return response.url;
  } catch (error) {
    console.log("Error uploading file to Cloudinary:", error);

    fs.unlinkSync(localFilePath);
  }
};

export { uploadOnCloudinary };
