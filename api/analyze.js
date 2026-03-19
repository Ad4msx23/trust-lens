export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { input } = req.body

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input is required' })
  }

  const sanitizedInput = input.trim().slice(0, 1000)

  if (sanitizedInput.length < 10) {
    return res.status(400).json({
      error: 'Input too short — describe your UI in at least 10 characters',
    })
  }

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
        system: `You are a UI/UX analyst specializing in AI trust design for security operations interfaces. You evaluate design decisions against six trust patterns: Confidence Calibration, Reasoning Visibility, Human Control, Auditability, Graceful Failure, and Alert Fatigue Reduction. Respond only with valid JSON. No markdown. No backticks. No preamble. Just the JSON object.`,
        messages: [
          {
            role: 'user',
            content: `Evaluate this design decision: "${sanitizedInput}"\n\nRespond with this exact JSON structure:\n{\n  "pattern": "which trust pattern applies most",\n  "verdict": "DO or DONT",\n  "analysis": "2-3 sentences explaining why",\n  "recommendation": "one concrete improvement"\n}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return res.status(502).json({ error: 'Analysis service unavailable' })
    }

    const data = await response.json()
    const text = data.content[0].text

    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const result = JSON.parse(clean)

    res.setHeader(
      'Access-Control-Allow-Origin',
      process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '*'
    )

    return res.status(200).json(result)
  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ error: 'Something went wrong — please try again' })
  }
}
