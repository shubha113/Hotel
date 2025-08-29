import jwt from "jsonwebtoken";

// generating jwt token using id, secret and expire
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREs_IN,
  });
};


//to send token when user login, for authentication
export const sendToken = (user, res, statusCode, message) => {
  const token = generateToken(user.id);

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
    message
  });
};

export default sendToken;