const mongoose = require("mongoose");
// for password encryption require bcryptjs
const bcrypt = require("bcryptjs");
//require json web token
const jwt = require("jsonwebtoken");
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
    select: false, //when we get an user from the api it will not return the password
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
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  // .sign takes a payload - we are using the user's id
  // method called on actual user so we have access to user id
  //second argument is the jwt secret and third argument is expires in text
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
// Match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // enteredPassword is the password from req.body
  // this method is called on the actual user so we have access to the user's field so we have access to user's hashed password in db
  //we compare the enteredPassword and this.password in db and return true or false
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);
