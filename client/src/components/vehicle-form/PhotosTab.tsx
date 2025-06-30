import React, { useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhotosTabProps {
    images: File[];
    setImages: React.Dispatch<React.SetStateAction<File[]>>;
    imageUrls: string[];
    setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
    existingImagePaths?: string[];
    setExistingImagePaths?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({
    setImages,
    imageUrls,
    setImageUrls,
    existingImagePaths = [],
    setExistingImagePaths,
}) => {
    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const newFiles = Array.from(e.target.files);
                setImages((prev) => [...prev, ...newFiles]);

                // Generate preview URLs
                const newUrls = newFiles.map((file) =>
                    URL.createObjectURL(file)
                );
                setImageUrls((prev) => [...prev, ...newUrls]);
            }
        },
        [setImages, setImageUrls]
    );

    const removeImage = useCallback(
        (index: number) => {
            // Check if this is an existing image or a new upload
            const existingImagesCount = existingImagePaths.length;

            if (index < existingImagesCount) {
                // This is an existing image
                if (setExistingImagePaths) {
                    setExistingImagePaths((prev) =>
                        prev.filter((_, i) => i !== index)
                    );
                }
                setImageUrls((prev) => prev.filter((_, i) => i !== index));
            } else {
                // This is a new image
                const newImageIndex = index - existingImagesCount;
                setImages((prev) => prev.filter((_, i) => i !== newImageIndex));

                // Revoke the object URL to avoid memory leaks
                URL.revokeObjectURL(imageUrls[index]);
                setImageUrls((prev) => prev.filter((_, i) => i !== index));
            }
        },
        [
            imageUrls,
            existingImagePaths.length,
            setImages,
            setImageUrls,
            setExistingImagePaths,
        ]
    );

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Vehicle Photos</h2>
                <p className="text-gray-500">
                    Upload photos of your vehicle. High-quality photos from
                    different angles will help attract potential buyers.
                </p>

                <div className="mt-6">
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG or JPEG (MAX. 10MB each)
                                </p>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg"
                                multiple
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>

                {imageUrls.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">
                            Uploaded Photos
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imageUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-md overflow-hidden group"
                                >
                                    <img
                                        src={url}
                                        alt={`Vehicle upload ${index + 1}`}
                                        className="w-full h-40 object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Tip: Include photos of the exterior from multiple
                        angles, interior, dashboard, engine bay, and any damage
                        or special features.
                    </p>
                </div>

                {imageUrls.length === 0 && (
                    <Alert>
                        <AlertDescription>
                            Listings with photos receive up to 5x more
                            inquiries. We recommend uploading at least 5 photos
                            of your vehicle.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </>
    );
};
