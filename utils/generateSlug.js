// utils/generateSlug.js
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-');      // Replace multiple hyphens with a single hyphen
};

module.exports = generateSlug;