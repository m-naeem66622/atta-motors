// Script to download vehicle images for the seeder data
const fs = require("fs");
const path = require("path");
const https = require("https");
const { promisify } = require("util");

// Path where images will be saved
const uploadDir = path.join(__dirname, "../public/vehicles");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
}

// Function to download an image from a URL
const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(uploadDir, filename);
        const file = fs.createWriteStream(filePath);

        https
            .get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(
                        new Error(
                            `Failed to download ${url}: ${response.statusCode}`
                        )
                    );
                    return;
                }

                response.pipe(file);

                file.on("finish", () => {
                    file.close();
                    console.log(`Downloaded: ${filename}`);
                    resolve(filePath);
                });

                file.on("error", (err) => {
                    fs.unlinkSync(filePath);
                    reject(err);
                });
            })
            .on("error", (err) => {
                fs.unlinkSync(filePath);
                reject(err);
            });
    });
};

// Extract image filenames from the vehicle seeder
const extractImageFilenames = () => {
    const seederPath = path.join(__dirname, "../seeders/vehicleSeeder.js");
    const content = fs.readFileSync(seederPath, "utf8");

    // Extract all image filenames using regex
    const regex = /images:\s*\[\s*((?:.*?\s*)+?)\s*\]/g;
    const imageFileList = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
        const imagesString = match[1];
        // Extract individual filenames by matching quoted strings
        const fileRegex = /"([^"]+)"|'([^']+)'/g;
        let fileMatch;
        while ((fileMatch = fileRegex.exec(imagesString)) !== null) {
            // The filename will be in group 1 or group 2 depending on quote type
            const filename = fileMatch[1] || fileMatch[2];
            if (filename) {
                // Extract just the filename part from the path
                const baseFilename = path.basename(filename);
                imageFileList.push(baseFilename);
            }
        }
    }

    return imageFileList;
};

// Map of image filenames to URLs where they can be downloaded
// Using more reliable Unsplash and Pexels image URLs
const getImageUrl = (filename) => {
    const imageMap = {
        // Toyota Corolla
        "toyota_corolla_1.jpg":
            "https://images.unsplash.com/photo-1626072778346-0ab6604d39c4?w=800&q=80",
        "toyota_corolla_2.jpg":
            "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800",

        // Honda Civic
        "honda_civic_1.jpg":
            "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80",
        "honda_civic_2.jpg":
            "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800",

        // Ford F-150
        "ford_f150_1.jpg":
            "https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?w=800&q=80",
        "ford_f150_2.jpg":
            "https://images.unsplash.com/photo-1474249559145-e9efe60832df?w=800&q=80",

        // Tesla Model 3
        "tesla_model3_1.jpg":
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
        "tesla_model3_2.jpg":
            "https://images.unsplash.com/photo-1572623880753-e5c1fe36c6fd?w=800&q=80",

        // BMW X5
        "bmw_x5_1.jpg":
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
        "bmw_x5_2.jpg":
            "https://images.pexels.com/photos/100656/pexels-photo-100656.jpeg?auto=compress&cs=tinysrgb&w=800",

        // Hyundai Tucson
        "hyundai_tucson_1.jpg":
            "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
        "hyundai_tucson_2.jpg":
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",

        // Mercedes C-Class
        "mercedes_cclass_1.jpg":
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
        "mercedes_cclass_2.jpg":
            "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",

        // Toyota RAV4
        "toyota_rav4_1.jpg":
            "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800&q=80",
        "toyota_rav4_2.jpg":
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",

        // Audi Q5
        "audi_q5_1.jpg":
            "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80",
        "audi_q5_2.jpg":
            "https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80",

        // Honda CR-V
        "honda_crv_1.jpg":
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
        "honda_crv_2.jpg":
            "https://images.unsplash.com/photo-1600259828526-77f8617ceec9?w=800&q=80",
    };

    return imageMap[filename] || null;
};

// Main function to download all images
const downloadAllImages = async () => {
    try {
        const imageFilenames = extractImageFilenames();
        console.log(
            `Found ${imageFilenames.length} image references in the seeder file`
        );

        const downloadPromises = imageFilenames.map(async (filename) => {
            const url = getImageUrl(filename);

            if (!url) {
                console.warn(`No URL mapping found for ${filename}. Skipping.`);
                return;
            }

            try {
                await downloadImage(url, filename);
            } catch (err) {
                console.error(`Error downloading ${filename}:`, err.message);
            }
        });

        await Promise.all(downloadPromises);
        console.log("All images downloaded successfully!");
    } catch (error) {
        console.error("Error downloading images:", error);
    }
};

// Run the download
downloadAllImages();
