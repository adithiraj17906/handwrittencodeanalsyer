import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Initializing with key ending in ...94N_Nk");
const genAI = new GoogleGenerativeAI("AIzaSyAhH8g4eiZdo-sm3baJ9H8VwFxTP94N_Nk");

async function testFlash() {
    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("SUCCESS: gemini-1.5-flash works!");
        console.log(result.response.text());
    } catch (error) {
        console.error("FAIL: gemini-1.5-flash error:", error.message);
    }
}

testFlash();
