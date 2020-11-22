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
  // send the token in a cookie
  sendTokenResponse(user, 200, res);
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
  // send the token in a cookie
  sendTokenResponse(user, 200, res);
});
// Get token from model, create cookie and send response
//we need acccess to the user,statuscode and response object to call res.status
const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      // calculate 30 days
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    // only access cookie through clien side scripts
    httpOnly: true,
  };
  // for production environment set the secure property to true // this will use https instead of http
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  // send token in response as a cookie
  res
    .status(statusCode)
    // .cookie takes 3 things, the key-what cookie is called, the token itself, the options
    .cookie("token", token, options)
    // we send some json data
    .json({ success: true, token });
};
// @desc    get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // since we are using protect route we have access to req.user which will always be logged in user
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: user,
  });
});
