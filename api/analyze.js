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
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a UI/UX analyst specializing in AI trust design for security operations interfaces. Evaluate design decisions against six trust patterns: Confidence Calibration, Reasoning Visibility, Human Control, Auditability, Graceful Failure, Alert Fatigue Reduction. Respond ONLY with valid JSON. No markdown. No backticks. No explanation. Just the JSON object.`,
        messages: [
          {
            role: 'user',
            content: `Evaluate this design decision: "${sanitizedInput}"\n\nRespond with exactly this JSON structure:\n{\n  "pattern": "name of the most relevant trust pattern",\n  "verdict": "DO",\n  "analysis": "2-3 sentences explaining the issue",\n  "recommendation": "one specific concrete improvement"\n}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic error:', response.status, errorText)
      return res.status(502).json({ error: 'Analysis service unavailable' })
    }

    const data = await response.json()
    const text = data.content[0].text
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
