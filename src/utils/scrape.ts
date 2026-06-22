export async function scrapeProfessorPage(url: string): Promise<string> {
  if (!url) {
    return '';
  }
  try {
    const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY || '';
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ url, formats: ['markdown'] })
    });

    if (!response.ok) {
      throw new Error(`Scraping failed with status: ${response.status}`);
    }

    const json = await response.json();
    return json.data?.markdown || '';
  } catch (error) {
    // Catch silently and return an empty string
    return '';
  }
}
