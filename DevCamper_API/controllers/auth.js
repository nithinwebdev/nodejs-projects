const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// require the model
const User = require("../models/User");
// @desc    Register User
// @route   GET /api/v1/register
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

  res.status(200).json({
    success: true,
  });
});
