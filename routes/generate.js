import express from "express";
import { generateFromAI } from "../utils/groq.js"; // ✅ FIX

const router = express.Router();

router.post("/generate", async (req, res) => {
    const { title, description, techStack } = req.body;

    if (!title) {
        return res.status(400).json({ error: "All fields required ❌" });
    }

    try {
        // 🔥 STEP 1: STRUCTURE (Better prompt)
        const structurePrompt = `
You are a senior software architect and academic writer.

Create a highly professional, detailed, and well-structured project synopsis in clean HTML format.

Project Details:
Title: ${title}
Description: ${description}
Technology Stack: ${techStack}

Requirements:

1. Write the synopsis like a complete technical documentation (not basic notes).
2. Explain the full working of the system step-by-step.
3. Clearly describe how each technology in the stack is used in different parts of the application (frontend, backend, database, APIs, etc.).
4. Show the flow of data and interaction between components (user → frontend → backend → database → response).
5. Include real-world explanations and practical implementation details.
6. Add proper hierarchy of headings and subheadings.
7. Use bullet points where needed for clarity.
8. Avoid repetition and keep content professional and readable.
9. Do NOT use markdown.

Structure:

<h1>Project Synopsis: ${title}</h1>

<h2>1. Introduction</h2>
<p>Explain purpose, importance, and overview of the system.</p>

<h2>2. Problem Statement</h2>
<p>Clearly explain real-world problems this project solves.</p>

<h2>3. Objectives</h2>
<ul>
<li>Write clear and practical objectives</li>
</ul>

<h2>4. System Architecture & Technology Stack</h2>
<p>Explain each technology and where it is used (frontend, backend, database).</p>
<ul>
<li>Frontend: explain role</li>
<li>Backend: explain role</li>
<li>Database: explain role</li>
</ul>

<h2>5. Working Flow of the System</h2>
<p>Explain step-by-step working:</p>
<ul>
<li>User interaction</li>
<li>Frontend processing</li>
<li>API calls</li>
<li>Backend logic</li>
<li>Database operations</li>
<li>Response handling</li>
</ul>

<h2>6. Methodology</h2>
<p>Explain development approach (Agile, modules, phases).</p>

<h2>7. Implementation Details</h2>
<p>Explain modules, features, and functionality.</p>

<h2>8. Testing</h2>
<p>Explain testing strategies and tools.</p>

<h2>9. Advantages of the System</h2>
<ul>
<li>List benefits</li>
</ul>

<h2>10. Conclusion</h2>
<p>Summarize the system and its impact.</p>

Important:
- TechStack that use in this project/website/software:${techStack}
- Description is :${description}
- Output MUST be in clean HTML only
- Use only these tags: <h1>, <h2>, <p>, <ul>, <li>
- Do not include markdown symbols like **, ###, ---
- Make the content detailed, structured, and visually readable
`;

        const structure = await generateFromAI(structurePrompt);

        // 🔥 STEP 2: PARALLEL CALLS (FAST ⚡)
        const sections = [
            "Introduction",
            "Problem Statement",
            "Objectives",
            "Literature Review",
            "Methodology",
            "Implementation",
            "Testing",
            "Conclusion"
        ];

        const promises = sections.map((sec) =>
            generateFromAI(`
You are an academic writer.

Write detailed content (300-500 words) for ${sec}

Project Title: ${title}
Description: ${description}
Technology: ${techStack}

Use simple English and proper formatting.
`)
        );

        const results = await Promise.all(promises);

        // 🔥 STEP 3: FORMAT OUTPUT
        let finalContent = "";

        sections.forEach((sec, i) => {
            finalContent += `<h2>${sec}</h2><p>${results[i]}</p>`;
        });

        res.json({
            output: structure + "\n\n" + finalContent
        });

    } catch (err) {
        console.error("Server Error:", err.message);

        res.status(500).json({
            error: "AI generation failed ❌",
            details: err.message
        });
    }
});

export default router;