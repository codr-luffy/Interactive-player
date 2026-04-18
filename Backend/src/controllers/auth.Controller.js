const userModel = require("./../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redis = require("../config/cache.js");

const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  const isAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyExist) {
    return res.status(400).json({
      message:
        "User already exist" + isAlreadyExist.email === email
          ? `with this ${email}`
          : `with this ${username}`,
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const loginController = async (req, res) => {
  const { email, password, username } = req.body;

  const user = await userModel
    .findOne({
      $or: [{ email }, { username }],
    })
    .select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User LogIn successfully",
    user: {
      username: user.username,
      email: user.email,
      _id: user._id,
    },
  });
};

const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: " user fetched successfully",
    user,
  });
};

const logoutUser = async (req, res) => {
  const token = req.cookies.token;

  res.clearcookie("token");

  await redis.set(token, Data.now().toString(), "EX", 60 * 60);

  res.staus(200).json({
    message: "Logout successfully",
  });
};

module.exports = { registerController, loginController, getMe, logoutUser };
