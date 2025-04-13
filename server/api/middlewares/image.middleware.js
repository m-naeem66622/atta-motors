const multer = require("multer");
const fs = require("fs");
const path = require("path");

let times = 0;

// Define paths for different types of uploads
const UPLOAD_PATHS = {
    USER: "public/users/",
    VEHICLE: "public/vehicles/",
};

// Create a configurable storage engine
const createStorage = (uploadType) => {
    const destinationPath = UPLOAD_PATHS[uploadType] || UPLOAD_PATHS.USER;

    return multer.diskStorage({
        destination: (req, file, cb) => {
            // console.log("3. Destination Path times", times);
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            // console.log("4. File Name times", times);
            try {
                fs.mkdirSync(destinationPath, { recursive: true });
                const filename = `${Date.now()}-${file.originalname}`;

                // console.log("Filename:", filename);
                cb(null, filename);
            } catch (error) {
                // console.error("Error in image upload", error);
                cb(new Error("Error occurred"));
            }
        },
    });
};

const avatarLimit = {
    fileSize: 1024 * 1024, // 1MB
};

const vehicleLimit = {
    fileSize: 1024 * 1024 * 5, // 5MB
};

const fileFilter = (req, file, cb) => {
    // console.log("2. File Filter times", ++times);
    const allowedFileTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/svg+xml",
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new multer.MulterError("UNSUPPORTED_FILE_TYPE", "avatar");
        error.message = "Only jpg, png & svg file types are supported";
        cb(error);
    }
};

// Create multer upload for user avatars
const avatarUpload = multer({
    storage: createStorage("USER"),
    limits: avatarLimit,
    fileFilter,
}).single("avatar");

const uploadImage = (req, res, next) => {
    times = 0;
    // console.log("1. Upload User Avatar");
    avatarUpload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                // console.log("Error:", error);
                return res.status(400).json({
                    status: "FAILED",
                    error: { avatar: "Multer: " + error.message },
                });
            } else {
                return res.status(500).json({
                    status: "INTERNAL_SERVER_ERROR",
                    message: "SORRY: Something went wrong",
                });
            }
        }

        // console.log("File:", req.file);
        // console.log("Avatar Path:", req.file?.path);
        if (req.file) {
            req.body.avatar = req.file.path;
        }

        next();
    });
};

// Create multer upload for vehicle images
const vehicleImagesUpload = multer({
    storage: createStorage("VEHICLE"),
    limits: vehicleLimit,
    fileFilter,
}).array("images", 5);

const uploadImages = (req, res, next) => {
    times = 0;
    // console.log("1. Upload Vehicle Images");
    vehicleImagesUpload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                // console.log("Error:", error);
                return res.status(400).json({
                    status: "FAILED",
                    error: { images: "Multer: " + error.message },
                });
            } else {
                return res.status(500).json({
                    status: "INTERNAL_SERVER_ERROR",
                    message: "SORRY: Something went wrong",
                });
            }
        }

        // console.log("Files:", req.files);
        // console.log("Files Path:", req.files?.map((file) => file.path));
        if (req.files) {
            req.body.images = req.files.map((file) => file.path);
        }

        next();
    });
};

module.exports = { uploadImage, uploadImages };
