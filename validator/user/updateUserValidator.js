// const { body } = require("express-validator");
// const User = require("../../src/model/User");

// module.exports = [
//   body("name")
//     .isLength({ min: 2, max: 20 })
//     .withMessage("User name must be 2 to 20 later")
//     .custom(async (name) => {
//       let user = await User.findOne({ name });
//       if (user) {
//         return Promise.reject("user name already used");
//       }
//     })
//     .trim(),
//   body("password")
//     .isLength({ min: 5 })
//     .withMessage("your password must have more then five char"),

//   body("avatar")
//     .isURL()
//     .withMessage("Please provide a valid URL for the avatar"),
// ];
// const { body } = require("express-validator");
// const User = require("../../src/model/User");

// module.exports = [
//   body("name").custom(async (name, { req }) => {
//     if (name !== null && name !== "") {
//       return body("name")
//         .isLength({ min: 2, max: 20 })
//         .withMessage("User name must be 2 to 20 letters")
//         .custom(async (name) => {
//           let user = await User.findOne({ name });
//           if (user) {
//             return Promise.reject("User name already used");
//           }
//         })
//         .trim()(req);
//     }
//   }),

//   body("password").custom(async (password, { req }) => {
//     if (password !== null && password !== "") {
//       return body("password")
//         .isLength({ min: 5 })
//         .withMessage("Your password must have more than five characters")(req);
//     }
//   }),

//   body("avatar").custom(async (avatar, { req }) => {
//     if (avatar !== null && avatar !== "") {
//       return body("avatar")
//         .isURL()
//         .withMessage("Please provide a valid URL for the avatar")(req);
//     }
//   }),
// ];
// const { body } = require("express-validator");
// const User = require("../../src/model/User");

// module.exports = [
//   body("name").custom(async (name, { req }) => {
//     if (name !== null && name !== "") {
//       return body("name")
//         .isLength({ min: 2, max: 20 })
//         .withMessage("User name must be 2 to 20 letters")
//         .custom(async (name) => {
//           let user = await User.findOne({ name });
//           if (user) {
//             return Promise.reject("User name already used");
//           }
//         })
//         .trim()(req);
//     }
//   }),

//   body("password").custom(async (password, { req }) => {
//     if (password !== null && password !== "") {
//       return body("password")
//         .isLength({ min: 5 })
//         .withMessage("Your password must have more than five characters")(req);
//     }
//   }),

//   body("avatar").custom(async (avatar, { req }) => {
//     if (avatar !== null && avatar !== "") {
//       return body("avatar")
//         .isURL()
//         .withMessage("Please provide a valid URL for the avatar")(req);
//     }
//   }),
// ];

// const { body } = require("express-validator");
// const User = require("../../src/model/User");

// module.exports = [
//   body("name").custom(async (name, { req }) => {
//     if (name !== null && name !== "") {
//       const errors = await body("name")
//         .isLength({ min: 2, max: 20 })
//         .withMessage("User name must be 2 to 20 letters")
//         .custom(async (name) => {
//           let user = await User.findOne({ name });
//           if (user) {
//             return Promise.reject("User name already used");
//           }
//         })
//         .trim()(req);

//       if (errors.length) {
//         throw new Error(errors[0].msg);
//       }
//     }
//   }),

//   body("password").custom(async (password, { req }) => {
//     if (password !== null && password !== "") {
//       const errors = await body("password")
//         .isLength({ min: 5 })
//         .withMessage("Your password must have more than five characters")
//         .trim()(req);

//       if (errors.length) {
//         throw new Error(errors[0].msg);
//       }
//     }
//   }),

//   body("avatar").custom(async (avatar, { req }) => {
//     if (avatar !== null && avatar !== "") {
//       const errors = await body("avatar")
//         .isURL()
//         .withMessage("Please provide a valid URL for the avatar")
//         .trim()(req);

//       if (errors.length) {
//         throw new Error(errors[0].msg);
//       }
//     }
//   }),
// ];
// const { body } = require("express-validator");
// const User = require("../../src/model/User");

// module.exports = [
//   body("name").custom((name, { req}) => {
//     if (name !== null && name !== "") {
//       console.log(name);
//       return body("name")
//         .isLength({ min: 2, max: 20 })
//         .withMessage("User name must be 2 to 20 letters")
//         .custom(async (name) => {
//           let user = await User.findOne({ name });
//           if (user) {
//             throw new Error("User name already used");
//           }

//         })
//         .trim()(req);
//     }

//   }),

//   body("password").custom((password, { req }) => {
//     if (password !== null && password !== "") {
//       return body("password")
//         .isLength({ min: 5 })
//         .withMessage("Your password must have more than five characters")
//         .trim()(req);
//     }
//   }),

//   body("avatar").custom((avatar, { req }) => {
//     if (avatar !== null && avatar !== "") {
//       return body("avatar")
//         .isURL()
//         .withMessage("Please provide a valid URL for the avatar")
//         .trim()(req);
//     }
//   }),
// ];
const { body } = require("express-validator");
const User = require("../../src/model/User");

module.exports = [
  body("name").custom(async (name, { req }) => {
    if (name !== null && name !== "") {
      console.log(name);

      // You can access 'res' and 'next' through the 'req' object
      const { res, next } = req;

      try {
        await body("name")
          .isLength({ min: 2, max: 20 })
          .withMessage("User name must be 2 to 20 letters")
          .custom(async (name) => {
            let user = await User.findOne({ name });
            if (user) {
              throw new Error("User name already used");
            }
          })
          .trim()(req);

        // You can use 'res' and 'next' here if needed
        // res.status(400).send("Some error message");
        // next();
      } catch (error) {
        // Handle the error here
        // res.status(400).send(error.message);
        // next(error);
      }
    }
  }),

  body("password").custom(async (password, { req }) => {
    if (password !== null && password !== "") {
      const { res, next } = req;

      try {
        await body("password")
          .isLength({ min: 5 })
          .withMessage("Your password must have more than five characters")
          .trim()(req);

        // You can use 'res' and 'next' here if needed
        // res.status(400).send("Some error message");
        // next();
      } catch (error) {
        // Handle the error here
        // res.status(400).send(error.message);
        // next(error);
      }
    }
  }),

  body("avatar").custom(async (avatar, { req }) => {
    if (avatar !== null && avatar !== "") {
      const { res, next } = req;

      try {
        await body("avatar")
          .isURL()
          .withMessage("Please provide a valid URL for the avatar")
          .trim()(req);

        // You can use 'res' and 'next' here if needed
        // res.status(400).send("Some error message");
        // next();
      } catch (error) {
        // Handle the error here
        // res.status(400).send(error.message);
        // next(error);
      }
    }
  }),
];
