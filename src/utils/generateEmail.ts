export async function generateEmail(
  formData: {
    name: string;
    background: string;
    interests: string;
    skills: string;
    degree: string;
    notableWork: string;
    profName: string;
    university: string;
  },
  scrapedContent: string,
  tone: string,
  length: string,
  thesisText: string,
  paper1: string,
  paper2: string,
  paper3: string,
  customInstructions: string
): Promise<string> {
  const prompt = `You are an expert academic research advisor helping a graduate school applicant write a highly personalized cold email to a professor.
STUDENT PROFILE:

Name: ${formData.name}

Background: ${formData.background}

Applying for: ${formData.degree}

Research interests: ${formData.interests}

Skills: ${formData.skills}

Notable work: ${formData.notableWork || 'None'}
STUDENT'S THESIS / RESEARCH PAPER (extracted text):

${thesisText ? thesisText.slice(0, 3000) : 'None'}
PROFESSOR PROFILE:

Name: ${formData.profName}

University: ${formData.university}

Professor's lab page content: ${scrapedContent ? scrapedContent.slice(0, 2000) : 'None'}
PROFESSOR'S RECENT PAPERS:

Paper 1: ${paper1 || 'None'}

Paper 2: ${paper2 || 'None'}

Paper 3: ${paper3 || 'None'}
YOUR TASK — perform this analysis step by step before writing the email:

Step 1 — Analyze the student's thesis: identify the core problem being solved, the methodology used, key results and contributions.

Step 2 — Analyze the professor's papers and lab page: identify their research focus, methods they use, open problems they are working on.

Step 3 — Find genuine overlaps: what methods, problems, or results appear in both the student's work and the professor's work? Be specific.

Step 4 — Identify a funding/research fit angle: how does the student's work validate, extend, or open a new direction in the professor's research? What concrete project could they work on together that would be fundable?

Step 5 — Write the cold email using the analysis above. The email must: open with a specific reference to one of the professor's papers and what genuinely interested the student about it, mention the student's thesis and a specific finding that connects to the professor's work, propose one concrete research direction they could explore together, include the funding fit angle naturally without sounding transactional, close with a clear ask for a brief call or email exchange. Tone: ${tone}. Length: ${length.toLowerCase()} (short is 200 words, detailed is 350 words).
CUSTOM INSTRUCTIONS FROM THE USER (follow these exactly):

${customInstructions || 'None'}
Return only the final email text. No subject line. No analysis output. No commentary. Just the email.`;

  const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || JSON.stringify(errJson);
    } catch (_e) {
      try {
        errorDetail = await response.text();
      } catch (_t) {
        errorDetail = response.statusText;
      }
    }
    throw new Error(`Groq API failed (${response.status}): ${errorDetail}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content || '';
}

export async function generateAnalysis(
  formData: {
    name: string;
    background: string;
    interests: string;
    skills: string;
    degree: string;
    notableWork: string;
    profName: string;
    university: string;
  },
  scrapedContent: string,
  thesisText: string,
  paper1: string,
  paper2: string,
  paper3: string
): Promise<string> {
  const prompt = `You are an expert academic research advisor helping a graduate school applicant analyze the overlap between their profile and a target professor's research.
STUDENT PROFILE:

Name: ${formData.name}

Background: ${formData.background}

Applying for: ${formData.degree}

Research interests: ${formData.interests}

Skills: ${formData.skills}

Notable work: ${formData.notableWork || 'None'}
STUDENT'S THESIS / RESEARCH PAPER (extracted text):

${thesisText ? thesisText.slice(0, 3000) : 'None'}
PROFESSOR PROFILE:

Name: ${formData.profName}

University: ${formData.university}

Professor's lab page content: ${scrapedContent ? scrapedContent.slice(0, 2000) : 'None'}
PROFESSOR'S RECENT PAPERS:

Paper 1: ${paper1 || 'None'}

Paper 2: ${paper2 || 'None'}

Paper 3: ${paper3 || 'None'}
YOUR TASK — perform this analysis step by step and output it:

Step 1 — Analyze the student's thesis: identify the core problem being solved, the methodology used, key results and contributions.

Step 2 — Analyze the professor's papers and lab page: identify their research focus, methods they use, open problems they are working on.

Step 3 — Find genuine overlaps: what methods, problems, or results appear in both the student's work and the professor's work? Be specific.

Step 4 — Identify a funding/research fit angle: how does the student's work validate, extend, or open a new direction in the professor's research? What concrete project could they work on together that would be fundable?

You MUST return the output in exactly this format with these section markers:
[Thesis Core Contribution]
[Your analysis for Step 1]

[Professor's Focus]
[Your analysis for Step 2]

[Key Overlaps]
[Your analysis for Step 3]

[Funding Fit Angle]
[Your analysis for Step 4]

Do not write the email. Do not include any other text, preambles, or postambles.`;

  const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || JSON.stringify(errJson);
    } catch (_e) {
      try {
        errorDetail = await response.text();
      } catch (_t) {
        errorDetail = response.statusText;
      }
    }
    throw new Error(`Groq API failed (${response.status}): ${errorDetail}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content || '';
}
