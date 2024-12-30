const express = require("express");
const route = express();
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

route.get("/:task", async (req, res) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Retrieve the task from the route parameter
    const task = req.params.task;

    // Craft the prompt to generate a to-do list in JSON format
    const prompt = `Generate a to-do list for the task '${task}'.The output should be in valid JSON format.Each item in the list must include the following fields: 'title', 'description', and 'priority'.Ensure that the 'title' is a brief but clear identifier of the task, 'description' provides additional context or details about the task, and 'priority' indicates the urgency of the task (e.g., 'High', 'Medium', 'Low').The final output should be structured as an array of JSON objects, formatted as follows: [{ 'title': 'Task 1', 'description': 'Description of Task 1', 'priority': 'High' }, { 'title': 'Task 2', 'description': 'Description of Task 2', 'priority': 'Medium' }, ...]`;

    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Parse the response
    const responseText = result.response;
    console.log(responseText.text);
 

    // Send the parsed JSON response
    res.status(200).json(responseText.text  );
  } catch (err) {
    // Handle errors
    const logger = require("pino")();
    logger.error({ err }, "Error generating to-do list");

    if (err?.status === 503) {
      return res.status(err?.status).json({ error: err?.statusText || "Service unavailable." });
    }

    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

module.exports = route;
