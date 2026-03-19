export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { input } = req.body

  if (!input || typeof input !== 'string' ||
      input.trim().length < 10) {
    return res.status(400).json({
      error: 'Please describe your UI in more detail',
    })
  }

  const sanitizedInput = input.trim().slice(0, 1000)
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API not configured' })
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.3,
          max_tokens: 500,
          messages: [
            {
              role: 'system',
              content: `You are a UI/UX analyst specializing in AI trust design for security operations interfaces. Evaluate design decisions against six trust patterns: Confidence Calibration, Reasoning Visibility, Human Control, Auditability, Graceful Failure, Alert Fatigue Reduction. You MUST respond with ONLY a valid JSON object. No markdown. No backticks. No explanation before or after. Just the raw JSON object.`,
            },
            {
              role: 'user',
              content: `Evaluate this UI design decision: "${sanitizedInput}"\n\nRespond with exactly this JSON structure and nothing else:\n{\n  "pattern": "name of the most relevant trust pattern",\n  "verdict": "DO or DONT",\n  "analysis": "2-3 sentences explaining why this is good or bad practice",\n  "recommendation": "one specific concrete improvement to make"\n}`,
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq error:', response.status, errorText)
      return res.status(502).json({ error: 'Analysis service unavailable' })
    }

    const data = await response.json()
    const text = data.choices[0].message.content

    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const result = JSON.parse(clean)
    return res.status(200).json(result)
  } catch (err) {
    console.error('Handler error:', err.message)
    return res.status(500).json({ error: 'Something went wrong — please try again' })
  }
}
