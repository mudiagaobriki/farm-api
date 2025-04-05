const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../../utils/emails/emails");
const mongoose = require("mongoose");
const ProfileModel = require("../models/Profile");
const {registerSchema, loginSchema} = require("../validation/auth");
const {sendVerificationEmail, sendPasswordForgotEmail} = require("../../utils/emails/sendEmails");

function UserController() {
  const register = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const { email, password, firstName } = value;

    // Check if user already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).json({ message: "User already exists. Please login." });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await User.create({
      ...value,
      password: encryptedPassword,
    });

    // Create login token
    const loginToken = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Save login token to the user
    user.loginToken = loginToken;
    await user.save();

    await sendVerificationEmail(email, user?._id, firstName)

    // Return new user (excluding sensitive data)
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.loginToken;

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "An error occurred during registration. Please try again later." });
  }
};

  const login = async (req, res) => {
  try {
    // Validate user input
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password"); // Include password field
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create login token
    const loginToken = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Save login token to the user
    user.loginToken = loginToken;
    await user.save();

    // Return user data (excluding sensitive fields)
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.loginToken;

    res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token: loginToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "An error occurred during login. Please try again later." });
  }
};

const verifyUser = async (req, res) => {
  const { verifyToken } = req.params;

  if (!verifyToken) {
    return res.status(400).json({ message: "Verification token is required." });
  }

  try {
    // Decode the token from base64
    const decodedToken = Buffer.from(verifyToken, "base64").toString("utf8");

    // Verify the JWT token
    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);

    if (!decoded?.email) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    // Find and update the user
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { verified: true, emailVerifiedAt: new Date() },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is already verified
    if (user.verified) {
      return res.status(200).json({ message: "User is already verified." });
    }

    // Return success response
    res.status(200).json({
      message: "Email verified successfully.",
      user: {
        email: user.email,
        verified: user.verified,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    });
  } catch (err) {
    console.error("Verification error:", err);

    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Verification link has expired." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid verification link." });
    }

    // Generic error response
    res.status(500).json({ message: "An error occurred during verification. Please try again later." });
  }
};

  const resendVerificationLink = async (req, res) => {
  const { email } = req.body;

  // Validate email input
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is already verified
    if (user.verified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Send the verification email
    await sendVerificationEmail(user.email, user._id, user.firstName);

    // Return success response
    res.status(200).json({
      message: "Verification email sent successfully.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ message: "An error occurred while resending the verification email. Please try again later." });
  }
};

  const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email input
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not registered. Please create an account." });
    }

    // Create a password reset token
    const resetToken = jwt.sign(
      { email: user.email, user_id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send the password reset email
    await sendPasswordForgotEmail(user, resetToken);

    // Return success response
    res.status(200).json({ message: "Password reset email sent successfully." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
  }
};

  const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  // Validate input
  if (!resetToken || !password) {
    return res.status(400).json({ message: "Reset token and new password are required." });
  }

  try {
    // Decode and verify the reset token
    const decodedToken = Buffer.from(resetToken, "base64").toString("utf8");
    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);

    if (!decoded?.email) {
      return res.status(400).json({ message: "Invalid reset token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return success response
    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);

    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid reset token." });
    }

    // Generic error response
    res.status(500).json({ message: "An error occurred while resetting the password. Please try again later." });
  }
};

  const resetPassword2 = async (req, res) => {
    const { email, password } = req.body;
    try {
      const filter = {
        email,
      };

      const update = {
        password: bcrypt.hashSync(password, 10),
      };

      console.log("Update: ", update);

      let user = await User.findOneAndUpdate(filter, update);
      let updatedUser = await User.findOne(filter);

      if (updatedUser) {
        console.log("User: ", updatedUser);
        res.send({
          status: "success",
          msg: "Password reset successful.",
        });
      } else {
        res.send({
          status: "failed",
          msg: "Password reset failed. Please try again.",
        });
      }

      // res.send(decoded?.email)
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return {
    register,
    login,
    verifyUser,
    resendVerificationLink,
    forgotPassword,
    resetPassword,
    resetPassword2,
  };
}

module.exports = UserController;
