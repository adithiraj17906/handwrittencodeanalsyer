import { GoogleGenerativeAI } from "@google/generative-ai";

// Hardcoding key here for the test script (from user's .env)
const genAI = new GoogleGenerativeAI("AIzaSyC5juYqgNgPs5Uo1Yj5q8dAqKbtN47xOt4");

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        // There isn't a direct "listModels" in the client SDK easily accessible without setup, 
        // but looking at the error message, the user can call ListModels via REST or check docs.
        // However, the node SDK *does* allow fetching model info if we use the model manager?
        // Actually, simply trying to run a generation with a few candidates might reveal the issue.
        // But better: assume standard REST call.

        // Let's try to just run a simple generation with the model we WANT to use.
        console.log("Testing gemini-1.5-flash-001...");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash-001");
        console.log(result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.5-flash-001:", error.message);
    }

    try {
        console.log("Testing gemini-1.5-flash...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result2 = await model2.generateContent("Hello");
        console.log("Success with gemini-1.5-flash");
        console.log(result2.response.text());
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);
    }

    try {
        console.log("Testing gemini-pro...");
        const model3 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result3 = await model3.generateContent("Hello");
        console.log("Success with gemini-pro");
        console.log(result3.response.text());
    } catch (error) {
        console.error("Error with gemini-pro:", error.message);
    }
}

listModels();
