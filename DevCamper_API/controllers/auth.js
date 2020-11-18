const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// require the model
const User = require("../models/User");
// @desc    Register User
// @route   POST /api/v1/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  // Create user
  //   mongoose returns a promise so we need to use await
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  // Create Token
  const token = user.getSignedJwtToken();
  // send the token in response
  res.status(200).json({
    success: true,
    token: token,
  });
});
// @desc    Login User
// @route   POST /api/v1/register
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email and password
  // check manually if email and password is present
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  // Check for User
  // check if the email from req.body is equal to the email searched in db using .findOne
  //.select('+password') in this case we also need to include the db, previously in the schema we had selected that the password should not be included, but we need the password for validation
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  // Check if password matches
  // we are using await because user.matchPassword() calls the bcrypt.compare which returns a promise from models\User.js
  //we pass the entered password which comes from the body
  // this returns true or false
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  // Create Token
  const token = user.getSignedJwtToken();
  // send the token in response
  res.status(200).json({
    success: true,
    token: token,
  });
});
