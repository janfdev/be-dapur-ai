const { PrismaClient } = require("@prisma/client");
const { createPrompt } = require("../schema");
const prisma = new PrismaClient();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateRecipe = async (req, res) => {
  try {
    let {
      ingredients,
      category,
      adjustment,
      calorieLimit,
      spicyLevel,
      avoidFoods,
    } = req.body;

    // Handle form-data/urlencoded array behavior
    if (ingredients && !Array.isArray(ingredients)) {
      ingredients = [ingredients];
    } else if (!ingredients) {
      ingredients = []; // Default to empty array if undefined
    }

    const userId = req.user.id;

    // 1. Fetch User Preferences if available
    const userPreferences = await prisma.userPreference.findUnique({
      where: { userId: parseInt(userId) },
    });

    // Merge: Request body (flat) > DB preferences > default (undefined will be handled)
    const finalPreferences = {
      calorieLimit: calorieLimit || userPreferences?.calorieLimit,
      spicyLevel: spicyLevel || userPreferences?.spicyLevel,
      avoidFoods: avoidFoods || userPreferences?.avoidFoods,
    };

    // 3. Create Prompt
    const prompt = createPrompt({
      category,
      ingredients,
      adjustmentText: adjustment,
      preferences: finalPreferences,
    });

    // 4. Call GROQ API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b", // Or your preferred model
    });

    const result = completion.choices[0]?.message?.content || "";

    // Optional: Save history to DB
    await prisma.recipeHistory.create({
      data: {
        userId: parseInt(userId),
        ingredients: ingredients.join(", "),
        category,
        adjustment: adjustment || "",
        result: result,
      },
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate recipe",
      error: error.message,
    });
  }
};

module.exports = { generateRecipe };
