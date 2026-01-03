const prisma = require("../client/index");

// Create Review
const createReview = async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    if (!name || isNaN(rating) || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, rating, and message are required.",
      });
    }

    const review = await prisma.review.create({
      data: {
        name,
        email,
        rating: parseInt(rating),
        message,
      },
    });

    return res.status(201).json({
      success: true,
      data: review,
      message: "Review created successfully",
    });
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Get Reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to recent 20 reviews
    });

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

module.exports = { createReview, getReviews };
