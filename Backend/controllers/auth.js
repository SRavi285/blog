const { User, File } = require("../models");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");

// signup controller
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.code = 400;
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// signin controller
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("Invalid credentials");
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      res.code = 401;
      throw new Error("Invalid credentials");
    }

    user.password = undefined;

    const token = generateToken(user);

    res.status(200).json({
      code: 200,
      status: true,
      message: "User SignIn successfully",
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
};

//email-verfication controller
const verifyCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    //user.isVerified === true is sms as user.isVerified
    if (user.isVerified) {
      res.code = 400;
      throw new Error("User already verified");
    }

    const code = generateCode(6);

    user.verificationCode = code;
    await user.save();

    //send email
    await sendEmail({
      emailTo: user.email,
      subject: "Email verification code",
      code,
      content: "verify your account",
    });

    res.status(200).json({
      code: 200,
      status: true,
      message: "User verification code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    if (user.verificationCode !== code) {
      res.code = 400;
      throw new Error("invalid verification code");
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ code: 200, message: "User verified successfully" });
  } catch (error) {
    next(error);
  }
};

const forgotePasswprdCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    const code = generateCode(6);
    user.forgotePasswprdCode = code;
    await user.save();

    await sendEmail({
      emailTo: user.email,
      subject: "Forgot Password code",
      code,
      content: "Change your Password",
    });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Forgot Password code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const recoverPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.code = 400;
      throw new Error("User not found");
    }

    if (user.forgotePasswprdCode !== code) {
      res.code = 400;
      throw new Error("Invalid code");
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.forgotePasswprdCode = null;
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Password recovered succefully!",
    });
  } catch (error) {
    next(error);
  }
};

const chnagePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    const match = await comparePassword(oldPassword, user.password);
    if (!match) {
      res.code = 400;
      throw new Error("Old password does not match");
    }

    if (oldPassword === newPassword) {
      res.code = 400;
      throw new Error("You are providing old password");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Password changed successfully",
      });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, email, profilePic } = req.body;

    const user = await User.findById(_id).select("-password -verificationCode -forgotePasswordCode");
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    if (email) {
      const isUserExist = await User.findOne({ email });
      if (isUserExist && isUserExist.email === email && String(user._id) !== String(isUserExist._id)) {
        res.code = 400;
        throw new Error("Email already exists");
      }
    }

    if (profilePic) {
      const file = await File.findById(profilePic);
      if (!file) {
        res.code = 404;
        throw new Error("File not found");
      }
    }

    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.profilePic = profilePic;

    if (email) {
      user.isVerified = false
    }

    await user.save();

    res.status(200).json({ code: 200, status: true, message: "User profile updated successfully", data: { user } })
  } catch (error) {
    next(error);
  }
}

const currentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id).select("-password -verificationCode -forgotPasswordCode").populate("profilePic");
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    res.status(200).json({ code: 200, status: true, message: "Get current user successfully", data: { user } })
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  signin,
  verifyCode,
  verifyUser,
  forgotePasswprdCode,
  recoverPassword,
  chnagePassword,
  updateProfile,
  currentUser,
};
