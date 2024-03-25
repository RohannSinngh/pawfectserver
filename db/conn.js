const mongoose = require("mongoose");
const Role = require("../model/roleSchema");
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {})
  .then(() => {
    console.log(`connnection successful`);
    initial();
  })
  .catch((err) => console.log(`no connection`));

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all([
        new Role({ name: "user" }).save(),
        new Role({ name: "admin" }).save(),
      ]);
      console.log("Roles added successfully.");
    }
  } catch (err) {
    console.error("Error initializing roles:", err);
  }
}
