const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const generateMathAnimation = async (prompt: string) => {
  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a mathematical animation for: ${prompt}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate animation');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    throw error;
  }
};