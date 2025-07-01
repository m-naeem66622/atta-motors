const {
    deleteFromCloudinary,
    extractPublicIdFromUrl,
} = require("../services/cloudinary.service");

/**
 * @description: Function to remove images from Cloudinary
 * @param {String|String[]|Object|Object[]} files - Cloudinary URLs, public IDs, or image objects
 * @returns {Promise<Object>}
 */
const imageCleanup = async (files) => {
    if (!files) return { success: true, data: { successful: [], failed: [] } };

    // Convert to array if single item is provided
    const filesList = Array.isArray(files) ? files : [files];

    // Extract public IDs from various formats
    const publicIds = filesList
        .map((file) => {
            if (typeof file === "string") {
                // If it's a URL, extract public ID
                if (file.startsWith("http")) {
                    return extractPublicIdFromUrl(file);
                }
                // If it's already a public ID
                return file;
            } else if (file && typeof file === "object") {
                // If it's an image object with public_id
                return file.public_id || extractPublicIdFromUrl(file.url);
            }
            return null;
        })
        .filter(Boolean); // Remove null values

    if (publicIds.length === 0) {
        return { success: true, data: { successful: [], failed: [] } };
    }

    // Delete from Cloudinary
    return await deleteFromCloudinary(publicIds);
};

module.exports = { imageCleanup };
