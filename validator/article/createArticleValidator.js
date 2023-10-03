const http = require("http");
const https = require("https");
const { body } = require("express-validator");

module.exports = [
  body("title")
    .isLength({ min: 10, max: 75 })
    .withMessage("Title must be between 10 and 75 characters")
    .trim(),
  body("body")
    .isLength({ min: 20 })
    .withMessage("Body should have at least 20 characters")
    .trim(),
  body("tags")
    .isLength({ min: 2, max: 20 })
    .withMessage("Tags should have between 2 and 20 characters")
    .trim(),
  
  body("cover")
      .optional()
      .isURL()
      .custom((value) => {
       
        if (value) {
          // Parse the URL to extract protocol and hostname
          const url = new URL(value);
          
          const protocol = url.protocol === "https:" ? https : http;

          return new Promise((resolve, reject) => {
            const request = protocol.request(
              url,
              {
                method: "HEAD",
              },
              (response) => {
                if (response.statusCode === 200) {
                  resolve();
                } else {
                  reject(new Error("Cover URL does not link to a valid image."));
                }
              }
            );

            request.on("error", (error) => {
              reject(new Error("Cover URL does not link to a valid image."));
            });

            request.end();
          });
        }
        return Promise.resolve(); // If no URL provided, consider it valid.
      }),
];

// Helper function to check if a URL is valid
// function isValidURL(url) {
//   // Implement your URL validation logic here, e.g., using regular expressions
//   const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
//   return urlRegex.test(url);
// }

