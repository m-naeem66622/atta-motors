const fs = require("fs");

/**
 * @description: Function to remove images from the server
 * @param {String|String[]} files - file path or array of file paths
 * @returns {Promise<void>}
 */
const imageCleanup = async (files) => {
    if (!files) return;

    // Convert to array if single string is provided
    const filesList = Array.isArray(files) ? files : [files];

    const deletePromises = filesList.map((file) => {
        return new Promise((resolve) => {
            fs.unlink(file, (error) => {
                if (error) {
                    fs.appendFileSync(
                        `logs/files-not-deleted.txt`,
                        file + "\n"
                    );
                    console.log(
                        "imagesCleanup -> failed while removing picture:",
                        file
                    );
                }
                resolve();
            });
        });
    });

    await Promise.all(deletePromises);
};

module.exports = { imageCleanup };
