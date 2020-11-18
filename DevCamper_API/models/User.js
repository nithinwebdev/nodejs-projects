const mongoose = require("mongoose");
// for password encryption require bcryptjs
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true, //two users cant have same email
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String, //user role can only be user or publisher so the value is an enum
    enum: ["user", "publisher"], //admin role will be manually created in mongodb atlas
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, //whjen we get an user from the api it will not return the password
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Middleware to Encrypt password using bcrypt -- to run before save
UserSchema.pre("save", async function (next) {
  // generate a salt to use that to hash the password, it returns a promise so we use await
  //.genSalt(10); 10 is the recommended number, the higher this salt value the more secure the password but more resource intensive
  const salt = await bcrypt.genSalt(10);
  // hash the password with the genSalt value using bcrypt
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model("User", UserSchema);
