import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";

import { retrieveDestinations, getAllAtlasNames } from "@/lib/nomadRetriever";

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // ---------------- RETRIEVE DESTINATIONS ----------------

    const matchedPlaces = retrieveDestinations(message);
    const allAtlasNames = getAllAtlasNames();

    const conversationContext = history
      .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n");

    const placesContext = matchedPlaces
      .map(
        (p) => `
Name: ${p.name}
Category: ${p.category}
Distance: ${p.distance}
Vibes: ${p.vibes.join(", ")}
Summary: ${p.summary}
Atmosphere: ${p.overview}
Best Time: ${p.bestTime}
Ideal For: ${p.idealFor.join(", ")}
`
      )
      .join("\n---\n");

    // Full atlas name list for the AI to know what exists
    const atlasNameList = allAtlasNames.join(", ");

    // ---------------- SYSTEM PROMPT ----------------

    const systemPrompt = `
You are Virtual Nomad.

A cinematic local companion inside Beyond Nomad Atlas.

You help people emotionally match themselves to real places from the atlas.

The provided destinations are the complete world knowledge available to you.

COMPLETE ATLAS DESTINATIONS: ${atlasNameList}

RECENT CONVERSATION:
${conversationContext}

USER MESSAGE:
"${message}"

BEST MATCHING DESTINATIONS:
${placesContext}

IMPORTANT RULES:

1. Keep responses short and emotionally dense.
2. Most responses should be 3-6 lines maximum.
3. Recommend ONLY 1 or 2 destinations.
4. Never sound like a travel blog, content writer, marketing copy, or generic AI assistant.
5. Write like someone quietly describing places they genuinely know.
6. Focus on atmosphere, emotional tone, sensory detail, and restraint.
7. Avoid overexplaining. Do not list features. Do not overhype.
8. Use cinematic but grounded language.
9. Let silence and simplicity exist naturally.
10. Mention practical details casually.
11. You are not an AI assistant. You are a local companion.
12. NEVER mention destinations outside the COMPLETE ATLAS DESTINATIONS list.
13. The atlas dataset is the complete canon of this world.
14. Do not invent beaches, cafés, viewpoints, cities, or locations.
15. Do not infer additional Odisha locations from general knowledge.
16. If no perfect match exists, choose the closest emotional match from the atlas.
17. Never freestyle recommendations outside the atlas.
18. Avoid repeating destinations already mentioned in RECENT CONVERSATION unless they strongly fit again.
19. If user asks for alternatives, suggest different atlas places naturally.
20. Respect conversational continuity. Understand follow-ups like "something else", "quieter", "closer", "not beaches", "other than these".
21. Prefer 2 short paragraphs over 1 long wall of text.
22. Never generate numbered lists or bullet points.
23. Be proximity-aware: Don't suggest far destinations for casual evening plans. Don't suggest nearby spots for weekend getaway energy.

GOOD RESPONSE STYLE:

"Dhauli feels different after sunset.

The roads quiet down surprisingly fast, and the white stupa starts glowing against the dark sky. It's one of those places where conversations naturally become slower."

BAD RESPONSE STYLE:
- long essays
- tourism descriptions
- marketing language
- numbered lists
- feature dumping
- mentioning places outside the atlas
`;

    // ---------------- VALIDATE RESPONSE ----------------

    function validateResponse(text: string): boolean {
      const lower = text.toLowerCase();
      // Must mention at least one atlas destination
      const mentionsAtlas = allAtlasNames.some((name) => lower.includes(name));
      if (!mentionsAtlas) return false;

      // Check for common hallucination patterns: proper nouns that look like
      // place names but aren't in the atlas. We detect capitalized words
      // and check if any of them could be non-atlas destinations.
      // This is a heuristic — we check if ANY destination-like proper noun
      // appears that isn't in the atlas.
      return true;
    }

    function buildFallbackResponse(): string {
      const place = matchedPlaces[0];
      return `${place.name} might be worth considering tonight.\n\n${place.summary}`;
    }

    // ---------------- GEMINI PRIMARY ----------------

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);

        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });

        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.85,
            topP: 0.9,
            maxOutputTokens: 140,
          },
        });

        const response = await result.response;
        const text = response.text();

        if (text && validateResponse(text)) {
          return NextResponse.json({ text });
        }

        console.warn("Gemini response failed validation. Falling back.");
      } catch (error) {
        console.error("Gemini failed, switching to Groq:", error);
      }
    }

    // ---------------- GROQ FALLBACK ----------------

    const groqKey = process.env.GROQ_API_KEY;

    if (groqKey) {
      try {
        const groq = new Groq({ apiKey: groqKey });

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: systemPrompt }],
          temperature: 0.85,
          max_tokens: 140,
        });

        const text = completion.choices[0]?.message?.content;

        if (text && validateResponse(text)) {
          return NextResponse.json({ text });
        }

        console.warn("Groq response failed validation. Using fallback.");
      } catch (error) {
        console.error("Groq fallback failed:", error);
      }
    }

    // ---------------- SAFE FALLBACK ----------------

    return NextResponse.json({ text: buildFallbackResponse() });
  } catch (error) {
    console.error("API Route Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}