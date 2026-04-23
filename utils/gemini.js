// import fetch from "node-fetch";

// export const generateFromAI = async (prompt) => {
//     try {
//         const apiKey = process.env.HF_API_KEY;

//         if (!apiKey) {
//             throw new Error("API key missing! Check your .env file.");
//         }

//         const response = await fetch(
//             "https://router.huggingface.co/hf-inference/models/google/flan-t5-large",
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${apiKey}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     inputs: prompt,
//                 }),
//             }
//         );

//         const data = await response.json();

//         // Hugging Face response handling
//         if (data.error) {
//             throw new Error(data.error);
//         }

//         return data[0]?.generated_text || "No response from AI";

//     } catch (err) {
//         console.error("Hugging Face Error:", err.message);
//         return `AI Error: ${err.message}`;
//     }
// };