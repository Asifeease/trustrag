/**
 * Multi-Provider LLM Service for TrustRAG
 * Supports Google Gemini, OpenAI, Groq, or Fallback RAG synthesis.
 */

export async function generateLegalResponse({ query, statutes, cases }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const systemPrompt = `You are TrustRAG, an authoritative, trusted Legal AI Assistant specializing in Indian Law (Bharatiya Nyaya Sanhita, IPC, CrPC/BNSS, Negotiable Instruments Act, Constitution of India, Family Law, Corporate Law, and Landmark Supreme Court Decisions).
You must provide objective, well-structured, and cited legal explanations.
Structure your answers with:
1. Executive Summary & Direct Answer
2. Key Legal Provisions & Statutory Sections (with exact act names)
3. Legal Process & Timelines (if applicable)
4. Landmark Precedents & Judgments (if applicable)
5. Legal Remedies & Important Considerations
Format with clean bullet points and clear paragraphs. Do not fabricate citations.`;

  const userPrompt = `Legal Query: "${query}"

Retrieved Context from Indian Law Knowledge Base:
Statutes: ${JSON.stringify(statutes.map(s => `${s.section} of ${s.act}: ${s.summary} ${s.details} (Punishment/Remedy: ${s.punishment})`))}
Landmark Precedents: ${JSON.stringify(cases.map(c => `${c.caseName} [${c.citation}]: ${c.significance}`))}`;

  // 1. Try Gemini if API key is provided
  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local synthesizer:", err.message);
    }
  }

  // 2. Try Groq if API key is provided
  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.2
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (err) {
      console.warn("Groq API call failed, falling back to local synthesizer:", err.message);
    }
  }

  // 3. Try OpenAI if API key is provided
  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.2
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to local synthesizer:", err.message);
    }
  }

  // If no external LLM key is configured, return null to trigger RAG fallback synthesizer
  return null;
}
