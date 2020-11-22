const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log("req.headers.authorization", req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //we split the datat in the format (Bearer tokendata) and get the tokendata using split
    token = req.headers.authorization.split(" ")[1];
  }
  //    else if (req.cookies.token) {
  //       token=req.cookies.token
  //   }
  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse(
        "No token 22 - Authorize to access this route--middleware"
      ),
      401
    );
  }
  // verify the token and extract the payload
  try {
    // verify takes the token and secret as arguments
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    // decoded has an id property which is the user id
    // use the decoded id which the user provided to login with correct credentials and use that id
    //to make a request to get the user - this user is the logged in user
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not  route"), 401);
  }
});
// Grant access to specific roles
// a comma separated value of roles are passed inside eg(publisher,admin)
exports.authorize = (...roles) => {
  console.log("roles", roles);
  // console.log("req", req);
  return (req, res, next) => {
    console.log("authorize called");
    console.log("req.user.role", req.user.role);
    // check if currently logged in user's role is included in what's passed in here
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized`),
        403
      );
    }
    next();
  };
};
