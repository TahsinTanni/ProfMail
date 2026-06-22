export async function generateSubjectLines(
  profName: string,
  university: string,
  paper: string,
  scrapedContent: string
): Promise<string[]> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

  const prompt = `Generate exactly 3 email subject lines for a student cold-emailing Professor ${profName}${university ? ` at ${university}` : ''}.
${paper ? `The student wants to mention this paper: "${paper}".` : ''}
${scrapedContent ? `Professor's research context (brief): ${scrapedContent.slice(0, 400)}` : ''}

Write 3 subject lines in this exact order:
1. Direct — concise, to the point (e.g. "Research Inquiry – [specific topic]")
2. Research-focused — references a paper, method, or topic explicitly
3. Warm — friendly yet professional, builds a personal connection

Return ONLY a valid JSON array of exactly 3 strings, no explanation, no markdown, no extra text.
Example format: ["Subject one here", "Subject two here", "Subject three here"]`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.85
      })
    });

    if (!response.ok) return [];

    const json = await response.json();
    const text: string = json.choices?.[0]?.message?.content || '[]';

    // Try direct parse first
    try {
      const parsed = JSON.parse(text.trim());
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 3).map(String);
      }
    } catch (_) {
      // Extract JSON array from response if wrapped in text
      const match = text.match(/\[[\s\S]*?\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) return parsed.slice(0, 3).map(String);
      }
    }
  } catch (_) {
    // Silently fail — subject lines are a bonus feature
  }

  return [];
}
