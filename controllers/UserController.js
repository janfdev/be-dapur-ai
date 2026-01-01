const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const prisma = require("../client/index");
const { validationResult } = require("express-validator");

// GET PROFILE
const getProfileUser = async (req, res) => {
  const userId = req.user && req.user.id;

  if (!userId) {
    return res.status(401).json({
      succes: false,
      message: "Unauthorized",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: `Get profile id: ${userId} successfully`,
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// FORGOT PASSWORD (DIRECT RESET)
const forgotPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Update user password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
module.exports = { getProfileUser, forgotPassword };
