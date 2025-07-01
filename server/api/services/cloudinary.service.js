const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @description: Upload image to Cloudinary with optimization
 * @param {Buffer|String} file - file buffer or file path
 * @param {String} folder - folder name in Cloudinary
 * @param {Object} options - additional options for upload
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (
    file,
    folder = "atta-motors",
    options = {}
) => {
    try {
        const uploadOptions = {
            folder,
            resource_type: "image",
            transformation: [
                { quality: "auto:good", fetch_format: "auto" }, // Optimize quality and format
                // { width: 1200, height: 1200, crop: "limit" }, // Limit max dimensions
            ],
            ...options,
        };

        let result;
        if (Buffer.isBuffer(file)) {
            // Upload from buffer
            result = await cloudinary.uploader
                .upload_stream(uploadOptions, (error, result) => {
                    if (error) throw error;
                    return result;
                })
                .end(file);
        } else {
            // Upload from file path
            result = await cloudinary.uploader.upload(file, uploadOptions);
        }

        return {
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                asset_id: result.asset_id,
                version_id: result.version_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
            },
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * @description: Delete image from Cloudinary
 * @param {String|Array} publicIds - public ID or array of public IDs
 * @returns {Promise<Object>} - deletion result
 */
const deleteFromCloudinary = async (publicIds) => {
    try {
        const ids = Array.isArray(publicIds) ? publicIds : [publicIds];

        const deletePromises = ids.map(async (publicId) => {
            try {
                const result = await cloudinary.uploader.destroy(publicId);
                return { publicId, success: result.result === "ok" };
            } catch (error) {
                console.error(`Failed to delete ${publicId}:`, error);
                return { publicId, success: false, error: error.message };
            }
        });

        const results = await Promise.all(deletePromises);
        const successful = results.filter((r) => r.success);
        const failed = results.filter((r) => !r.success);

        return {
            success: failed.length === 0,
            data: {
                successful: successful.map((r) => r.publicId),
                failed: failed.map((r) => ({
                    publicId: r.publicId,
                    error: r.error,
                })),
            },
        };
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * @description: Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String|null} - public ID or null
 */
const extractPublicIdFromUrl = (url) => {
    try {
        if (!url || typeof url !== "string") return null;

        // Handle different Cloudinary URL formats
        const urlPatterns = [
            /\/v\d+\/([^\/]+)\./,
            /\/upload\/v\d+\/([^\/]+)\./,
        ];

        for (const pattern of urlPatterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return null;
    } catch (error) {
        console.error("Error extracting public ID:", error);
        return null;
    }
};

/**
 * @description: Create Cloudinary storage for multer
 * @param {String} folder - folder name in Cloudinary
 * @returns {Object} - multer storage configuration
 */
const createCloudinaryStorage = (folder = "atta-motors") => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder,
            resource_type: "image",
            transformation: [
                { quality: "auto:good", fetch_format: "auto" },
                { width: 1200, height: 1200, crop: "limit" },
            ],
        },
    });
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    extractPublicIdFromUrl,
    createCloudinaryStorage,
    cloudinary,
};
