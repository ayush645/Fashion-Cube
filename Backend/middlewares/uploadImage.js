const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

const resizeAndMove = async (files, destinationFolder) => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const imagePath = file.path;
        const resizedImagePath = path.join(
          __dirname,
          `../public/images/${destinationFolder}/${file.filename}`
        );

        await sharp(imagePath)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(resizedImagePath);

        // Delete the original image after resizing
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error('Error processing/resizing file:', error);
        // Handle the error (e.g., log, send an error response)
      }
    })
  );
};

const productImgResize = async (req, res, next) => {
  if (!req.files) return next();

  await resizeAndMove(req.files, 'products');
  next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();

  await resizeAndMove(req.files, 'blogs');
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
