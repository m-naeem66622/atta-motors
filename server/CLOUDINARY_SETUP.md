# Cloudinary Setup Guide

## Prerequisites

1. Create a Cloudinary account at [https://cloudinary.com](https://cloudinary.com)
2. Get your Cloudinary credentials from your dashboard

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Installation

Install the required dependencies:

```bash
npm install cloudinary multer-storage-cloudinary
```

## Features

### Image Optimization

- Automatic quality optimization (`auto:good`)
- Format optimization (WebP, AVIF when supported)
- Maximum dimensions: 1200x1200 pixels
- Maintains aspect ratio

### Storage Structure

- User avatars: `atta-motors/users/`
- Vehicle images: `atta-motors/vehicles/`

### Backward Compatibility

- The system handles both legacy local image paths and new Cloudinary URLs
- Existing images will continue to work during migration

## Migration Notes

### Database Changes

- Vehicle model now stores Cloudinary image objects instead of simple strings
- Each image object contains: `url`, `public_id`, `asset_id`, `version_id`, `width`, `height`, `format`, `bytes`

### Frontend Changes

- New utility functions in `client/src/utils/imageUtils.ts`
- Components updated to handle both legacy and new image formats
- No changes required to existing image upload UI

### Backend Changes

- Image middleware updated to use Cloudinary storage
- Image cleanup utility updated to delete from Cloudinary
- Vehicle controller updated to handle image object structure

## Error Handling

- Failed uploads are logged and cleaned up
- Failed deletions are logged but don't break the application
- Graceful fallbacks for missing images

## Security

- Cloudinary credentials are stored in environment variables
- Images are served over HTTPS
- Public IDs are used for deletion (not URLs)
