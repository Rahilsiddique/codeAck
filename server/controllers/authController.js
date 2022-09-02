const { google } = require("googleapis");
const url = require("url");
const axios = require("axios");
const JWT = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the environment variables.
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URL
);

// Access scopes.
const scopes = ["email", "profile"];

// Generate a url
const authorizationUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "offline",
  /** Pass in the scopes array defined above.
   * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
  scope: scopes,
});

async function getUserInfo(token) {
  try {
    return (
      await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      )
    ).data;
  } catch (err) {}
}
exports.getUserInfo = getUserInfo;

async function login(req, res, next) {
  const token = req.cookies?.jwt;
  let data = {};
  if (token) {
    const decoded = JWT.verify(req.cookies.jwt, process.env.JWT_SECRET);
    data = await getUserInfo(decoded);
  } else {
    data = await getUserInfo(req.tokens);
  }
  return data;
}
exports.login = login;

exports.displayUserDetails = catchAsync(async (req, res, next) => {
  const decoded = JWT.verify(req.cookies.jwt, process.env.JWT_SECRET);
  res.status(200).json(decoded);
});

exports.oauth2callback = catchAsync(async (req, res, next) => {
  // 1. Receive the callback from Google's OAuth 2.0 server. Handle the OAuth 2.0 server response
  let q = url.parse(req.url, true).query;

  // 2. Get access and refresh tokens (if access_type is offline)
  let { tokens } = await oauth2Client.getToken(q.code);
  oauth2Client.setCredentials(tokens);
  req.tokens = tokens;
  const results = await login(req, res, next);
  const userinfo = results;

  // 3. If user doesn't already exist create the user in the database
  const users = {
    userId: userinfo.id,
    name: userinfo.name,
    email: userinfo.email,
    profilePicture: userinfo.picture,
  };
  // User Signup
  if (!(await User.findOne({ email: users.email }))) {
    const user = await User.create(users);
  } else {
    // User Login
    await User.findOneAndUpdate(
      { email: userinfo.email },
      {
        lastLoginAt: new Date(Date.now()).getTime(),
      }
    );
  }

  // 4. Create a JWT token
  let token = JWT.sign(
    {
      access_token: tokens.access_token,
      userdata: userinfo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  // 5. Create a JWT_COOKIE using tokens and user_info
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.status(200).json({
    status: "success",
    message: "User signed in Successfully",
  });
});

exports.redirectToAuthUrl = (req, res, next) => {
  res.redirect(authorizationUrl);
};

exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies?.jwt;
  token === undefined
    ? res.status(401).json({ status: "fail", message: "Unauthenticated" })
    : next();
};