const { VITE_APP_IMAGE_URL } = import.meta.env;

export interface CloudinaryImage {
    url: string;
    public_id: string;
    asset_id?: string;
    version_id?: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
}

/**
 * Get the image URL from either a Cloudinary image object or a legacy string path
 * @param image - Can be a Cloudinary image object, URL string, or legacy path string
 * @returns The complete image URL
 */
export const getImageUrl = (
    image: CloudinaryImage | string | undefined
): string => {
    if (!image) return "";

    // If it's already a full URL (Cloudinary or other)
    if (typeof image === "string" && image.startsWith("http")) {
        return image;
    }

    // If it's a Cloudinary image object
    if (typeof image === "object" && image.url) {
        return image.url;
    }

    // If it's a legacy local path, prepend the base URL
    if (typeof image === "string") {
        return `${VITE_APP_IMAGE_URL}/${image}`;
    }

    return "";
};

/**
 * Get the first image URL from an array of images
 * @param images - Array of Cloudinary image objects, URLs, or legacy paths
 * @returns The complete image URL of the first image
 */
export const getFirstImageUrl = (
    images: (CloudinaryImage | string)[] | undefined
): string => {
    if (!images || images.length === 0) return "";
    return getImageUrl(images[0]);
};

/**
 * Convert legacy image paths to Cloudinary image objects for backward compatibility
 * @param images - Array of image strings or Cloudinary objects
 * @returns Array of Cloudinary image objects
 */
export const normalizeImages = (
    images: (CloudinaryImage | string)[] | undefined
): CloudinaryImage[] => {
    if (!images) return [];

    return images.map((image, index) => {
        if (typeof image === "object" && image.url) {
            return image;
        }

        // Convert legacy string to Cloudinary object format
        const url = getImageUrl(image);
        return {
            url,
            public_id: `legacy_${index}_${Date.now()}`,
        };
    });
};
