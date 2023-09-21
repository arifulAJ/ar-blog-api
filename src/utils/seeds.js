const { faker } = require("@faker-js/faker");
const User = require("../model/User");

const seedUsers = (noOfUsers = 5) => {
  for (let i = 0; i < noOfUsers; i++) {
    const user = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    user.save();
  }
};
module.exports = { seedUsers };
