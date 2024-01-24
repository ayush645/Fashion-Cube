const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImg = (fileToUploads, folderName) => {
  return new Promise((resolve, reject) => {
    console.log("enter the cloudinary");

    const uploadOptions = {
      folder: process.env.FOLDER_NAME,
      resource_type: "auto",
    };

    cloudinary.uploader.upload(fileToUploads, uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        console.log('Cloudinary upload result:', result);
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
          resource_type: "auto",
        });
      }
    });
  });
};

const cloudinaryDeleteImg = (fileToDelete) => {
  return new Promise((resolve, reject) => {
    const deleteOptions = {
      folder: process.env.FOLDER_NAME,
      resource_type: "auto",
    };

    cloudinary.uploader.destroy(fileToDelete, deleteOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary delete error:', error);
        reject(error);
      } else {
        console.log('Cloudinary delete result:', result);
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
          resource_type: "auto",
        });
      }
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
