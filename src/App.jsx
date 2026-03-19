import { useState } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

const PATTERNS = [
  {
    id: 'trust-calibration',
    category: 'Trust Calibration',
    title: 'Confidence calibration',
    principle: 'The UI must change based on how certain the AI is. Different confidence = different layout, CTA, and tone.',
    do: "Show a muted 'Low confidence' badge and softer CTA when AI certainty is below 70%",
    dont: "Display the same bold 'Take action' button regardless of AI confidence score",
    frameworks: ['Google PAIR', 'IBM Carbon AI'],
  },
  {
    id: 'reasoning-visibility',
    category: 'Reasoning Visibility',
    title: 'Chain of thought',
    principle: "Show the AI's reasoning as a visual chain, not a paragraph. Each step is clickable and links to raw evidence.",
    do: 'Render each reasoning step as a node in a visual chain with click-through to source data',
    dont: "Dump the AI's explanation as a wall of unstructured text with no links",
    frameworks: ['Microsoft HAX', 'WEF Trust Stack'],
  },
  {
    id: 'human-control',
    category: 'Human Control',
    title: 'Human-in-the-loop override',
    principle: "The AI will be wrong. 'Correct the AI' is a first-class feature, not an edge case.",
    do: "Place a visible 'Override' button on every AI decision, with a simple correction flow",
    dont: "Hide correction behind Settings > Advanced > Feedback, analysts won't find it under pressure",
    frameworks: ['Google PAIR', 'Microsoft HAX'],
  },
  {
    id: 'evidence-trail',
    category: 'Evidence Trail',
    title: 'Auditability',
    principle: 'Every AI decision must link to the raw data that caused it. One click. No new tab.',
    do: 'Inline expandable evidence panel: analyst sees the log line that triggered the alert',
    dont: "Link to a separate audit log page that breaks the analyst's flow and context",
    frameworks: ['IBM Carbon AI', 'WEF Trust Stack'],
  },
  {
    id: 'failure-design',
    category: 'Failure Design',
    title: 'Graceful failure',
    principle: 'Design for when the AI is wrong or unsure with the same care as the happy path.',
    do: "Distinct 'AI unsure' state with a clear explanation and manual fallback option",
    dont: 'Show a generic error message or silently fall back to a default action',
    frameworks: ['Microsoft HAX', 'Google PAIR'],
  },
  {
    id: 'cognitive-load',
    category: 'Cognitive Load',
    title: 'Alert fatigue reduction',
    principle: 'Analysts see hundreds of alerts daily. Most are false positives. Real threats must break the visual pattern.',
    do: 'Use strong visual disruption (color, size, motion) only for confirmed high-severity threats',
    dont: 'Style all alerts the same; analysts will start ignoring everything including real threats',
    frameworks: ['IBM Carbon AI', 'WEF Trust Stack'],
  },
]

const FRAMEWORKS = [
  {
    name: 'Google PAIR',
    org: 'Google',
    covers: 'People + AI Research Guidebook, UX patterns for human-AI collaboration',
    url: 'https://pair.withgoogle.com/guidebook',
  },
  {
    name: 'Microsoft HAX',
    org: 'Microsoft',
    covers: 'Human-AI Experience guidelines, 18 design principles for AI products',
    url: 'https://www.microsoft.com/en-us/haxtoolkit',
  },
  {
    name: 'IBM Carbon AI',
    org: 'IBM',
    covers: 'Enterprise AI design system, patterns for transparency and trust at scale',
    url: 'https://carbondesignsystem.com',
  },
  {
    name: 'WEF Trust Stack',
    org: 'World Economic Forum',
    covers: 'AI governance principles, accountability and explainability at org level',
    url: 'https://www.weforum.org/reports/ai-governance',
  },
]

const ANALYZER_EXAMPLES = [
  "I'm showing AI confidence as a % in the header",
  "Our alert cards all look the same regardless of severity",
  "The AI explanation is a paragraph of text below the alert",
  "There's no way for analysts to correct an AI decision",
]

// ── SVG Mockups ───────────────────────────────────────────────────────────────

const DoVisual = ({ id }) => {
  if (id === 'trust-calibration') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="184" height="64" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="18" y="18" width="108" height="18" rx="2" fill="rgba(255,180,0,0.12)" stroke="rgba(255,180,0,0.4)" strokeWidth="1"/>
      <text x="72" y="30.5" textAnchor="middle" fontSize="9" fill="#FFB400" fontFamily="monospace">Low confidence: 42%</text>
      <rect x="18" y="44" width="88" height="16" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth="1"/>
      <text x="62" y="55.5" textAnchor="middle" fontSize="8.5" fill="#6f6f6f" fontFamily="monospace">Review manually</text>
    </svg>
  )
  if (id === 'reasoning-visibility') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="10" y="28" width="44" height="24" rx="3" fill="#222" stroke="rgba(104,255,125,0.35)" strokeWidth="1"/>
      <text x="32" y="43" textAnchor="middle" fontSize="7" fill="#a8a8a8" fontFamily="monospace">Login</text>
      <line x1="54" y1="40" x2="70" y2="40" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <polygon points="70,37 76,40 70,43" fill="rgba(255,255,255,0.18)"/>
      <rect x="76" y="28" width="48" height="24" rx="3" fill="#222" stroke="rgba(104,255,125,0.35)" strokeWidth="1"/>
      <text x="100" y="43" textAnchor="middle" fontSize="7" fill="#a8a8a8" fontFamily="monospace">Escalate</text>
      <line x1="124" y1="40" x2="140" y2="40" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <polygon points="140,37 146,40 140,43" fill="rgba(255,255,255,0.18)"/>
      <rect x="146" y="28" width="46" height="24" rx="3" fill="#222" stroke="rgba(104,255,125,0.65)" strokeWidth="1.5"/>
      <text x="169" y="43" textAnchor="middle" fontSize="7" fill="#68FF7D" fontFamily="monospace">Verdict</text>
    </svg>
  )
  if (id === 'human-control') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="10" width="184" height="60" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="18" y="20" width="52" height="13" rx="2" fill="rgba(255,107,107,0.14)" stroke="rgba(255,107,107,0.38)" strokeWidth="1"/>
      <text x="44" y="30" textAnchor="middle" fontSize="7.5" fill="#FF6B6B" fontFamily="monospace">HIGH RISK</text>
      <rect x="118" y="18" width="64" height="17" rx="2" fill="rgba(104,255,125,0.09)" stroke="rgba(104,255,125,0.45)" strokeWidth="1"/>
      <text x="150" y="30" textAnchor="middle" fontSize="8" fill="#68FF7D" fontFamily="monospace">Override →</text>
      <rect x="18" y="42" width="118" height="4" rx="1" fill="rgba(255,255,255,0.1)"/>
      <rect x="18" y="50" width="80" height="4" rx="1" fill="rgba(255,255,255,0.07)"/>
    </svg>
  )
  if (id === 'evidence-trail') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="22" width="184" height="36" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="18" y="31" width="86" height="4" rx="1" fill="rgba(255,255,255,0.14)"/>
      <rect x="18" y="39" width="58" height="4" rx="1" fill="rgba(255,255,255,0.08)"/>
      <rect x="122" y="28" width="62" height="16" rx="2" fill="rgba(104,255,125,0.07)" stroke="rgba(104,255,125,0.32)" strokeWidth="1"/>
      <text x="153" y="39.5" textAnchor="middle" fontSize="7.5" fill="#68FF7D" fontFamily="monospace">Evidence ▾</text>
    </svg>
  )
  if (id === 'failure-design') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="6" width="184" height="68" rx="3" fill="rgba(255,180,0,0.04)" stroke="rgba(255,180,0,0.28)" strokeWidth="1"/>
      <rect x="18" y="14" width="64" height="14" rx="2" fill="rgba(255,180,0,0.14)" stroke="rgba(255,180,0,0.38)" strokeWidth="1"/>
      <text x="50" y="24.5" textAnchor="middle" fontSize="8" fill="#FFB400" fontFamily="monospace">AI unsure</text>
      <rect x="18" y="34" width="128" height="4" rx="1" fill="rgba(255,255,255,0.1)"/>
      <rect x="18" y="42" width="88" height="4" rx="1" fill="rgba(255,255,255,0.07)"/>
      <rect x="18" y="54" width="76" height="13" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <text x="56" y="63.5" textAnchor="middle" fontSize="7.5" fill="#a8a8a8" fontFamily="monospace">Review manually</text>
    </svg>
  )
  if (id === 'cognitive-load') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      {[6, 22, 38].map((y) => (
        <rect key={y} x="8" y={y} width="184" height="12" rx="2" fill="#1c1c1c" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      ))}
      <rect x="8" y="56" width="184" height="18" rx="2" fill="rgba(255,107,107,0.11)" stroke="rgba(255,107,107,0.48)" strokeWidth="1.5"/>
      <text x="22" y="68" fontSize="8.5" fill="#FF6B6B" fontFamily="monospace" fontWeight="600">● CRITICAL THREAT</text>
    </svg>
  )
  return null
}

const DontVisual = ({ id }) => {
  if (id === 'trust-calibration') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="184" height="64" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="18" y="30" width="92" height="20" rx="2" fill="#68FF7D"/>
      <text x="64" y="44" textAnchor="middle" fontSize="9.5" fill="#0f0f0f" fontFamily="monospace" fontWeight="600">Take action</text>
    </svg>
  )
  if (id === 'reasoning-visibility') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="184" height="64" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      {[16, 23, 30, 37, 44, 51, 58].map((y, i) => (
        <rect key={i} x="18" y={y} width={90 + (i % 4) * 18} height="4" rx="1" fill="rgba(255,255,255,0.1)"/>
      ))}
    </svg>
  )
  if (id === 'human-control') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="10" width="184" height="60" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="18" y="20" width="52" height="13" rx="2" fill="rgba(255,107,107,0.14)" stroke="rgba(255,107,107,0.38)" strokeWidth="1"/>
      <text x="44" y="30" textAnchor="middle" fontSize="7.5" fill="#FF6B6B" fontFamily="monospace">HIGH RISK</text>
      <circle cx="172" cy="26" r="2" fill="rgba(255,255,255,0.2)"/>
      <circle cx="180" cy="26" r="2" fill="rgba(255,255,255,0.2)"/>
      <circle cx="164" cy="26" r="2" fill="rgba(255,255,255,0.2)"/>
      <rect x="18" y="42" width="118" height="4" rx="1" fill="rgba(255,255,255,0.1)"/>
      <rect x="18" y="50" width="80" height="4" rx="1" fill="rgba(255,255,255,0.07)"/>
    </svg>
  )
  if (id === 'evidence-trail') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="22" width="184" height="36" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="18" y="31" width="86" height="4" rx="1" fill="rgba(255,255,255,0.14)"/>
      <rect x="18" y="39" width="58" height="4" rx="1" fill="rgba(255,255,255,0.08)"/>
      <text x="158" y="37" textAnchor="middle" fontSize="7" fill="#3f3f3f" fontFamily="monospace">Audit log ↗</text>
    </svg>
  )
  if (id === 'failure-design') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="6" width="184" height="68" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="18" y="14" width="36" height="14" rx="2" fill="rgba(255,255,255,0.07)"/>
      <text x="36" y="24.5" textAnchor="middle" fontSize="8" fill="#6f6f6f" fontFamily="monospace">Error</text>
      <rect x="18" y="34" width="110" height="4" rx="1" fill="rgba(255,255,255,0.06)"/>
      <rect x="18" y="42" width="70" height="4" rx="1" fill="rgba(255,255,255,0.04)"/>
    </svg>
  )
  if (id === 'cognitive-load') return (
    <svg viewBox="0 0 200 80" className="w-full" fill="none" aria-hidden="true">
      {[6, 22, 38, 54].map((y) => (
        <g key={y}>
          <rect x="8" y={y} width="184" height="12" rx="2" fill="#1c1c1c" stroke="rgba(255,107,107,0.28)" strokeWidth="1"/>
          <text x="22" y={y + 8.5} fontSize="7.5" fill="#FF6B6B" fontFamily="monospace" opacity="0.55">● Alert</text>
        </g>
      ))}
    </svg>
  )
  return null
}

// ── Pattern card ──────────────────────────────────────────────────────────────

function PatternCard({ pattern, isOpen, onToggle, index }) {
  return (
    <div
      className={[
        'border border-l-2 rounded-sm mb-3 cursor-pointer opacity-0 animate-fade-up',
        'transition-colors duration-200 bg-surface',
        isOpen
          ? 'border-accent/20 border-l-accent'
          : 'border-white/[0.06] border-l-accent/30 hover:border-accent/20 hover:border-l-accent/60',
      ].join(' ')}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
      onClick={onToggle}
      role="button"
      aria-expanded={isOpen}
    >
      {/* Header row */}
      <div className="flex justify-between items-start px-6 py-5">
        <div className="flex-1 min-w-0 pr-4">
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-muted mb-1.5">
            {pattern.category}
          </div>
          <div className="text-sm font-medium text-text-primary mb-1">
            {pattern.title}
          </div>
          <div className="text-sm text-text-muted leading-relaxed">
            {pattern.principle}
          </div>
        </div>
        <div className="flex items-center shrink-0 mt-1 gap-2">
          <span className="font-mono text-[10px] text-text-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={['text-accent text-sm transition-transform duration-150', isOpen ? 'rotate-180' : ''].join(' ')}>
            ▾
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-6 pb-6 border-t border-white/[0.06]">
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* DO panel */}
            <div className="bg-accent/[0.04] border border-accent/20 rounded-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-accent text-xs">✓</span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-medium">Do</span>
              </div>
              <DoVisual id={pattern.id} />
              <p className="text-xs text-text-muted leading-relaxed mt-3">{pattern.do}</p>
            </div>

            {/* DON'T panel */}
            <div className="bg-danger/[0.04] border border-danger/20 rounded-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-danger text-xs">✗</span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-danger font-medium">Don't</span>
              </div>
              <DontVisual id={pattern.id} />
              <p className="text-xs text-text-muted leading-relaxed mt-3">{pattern.dont}</p>
            </div>
          </div>

          {/* Framework tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {pattern.frameworks.map((fw) => (
              <span key={fw} className="font-mono text-[10px] border border-white/20 text-text-muted px-2 py-1 rounded-sm">
                {fw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Analyzer ──────────────────────────────────────────────────────────────────

function Analyzer({ input, setInput }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState(null)

  const handleAnalyze = async () => {
    if (!input.trim() || isAnalyzing) return
    setIsAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handleAnalyze() }
  }

  const verdictIsPositive = result?.verdict === 'DO'

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. 'I'm showing AI confidence as a percentage in the alert card header'"
        className="w-full bg-surface border border-white/[0.06] rounded-sm p-4 text-sm text-text-primary placeholder-[#757575] font-sans resize-none h-32 focus:outline-none focus:border-accent/40 transition-colors duration-150 leading-relaxed"
      />

      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !input.trim()}
          className="px-5 py-2.5 bg-accent text-base font-mono text-xs tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze →'}
        </button>
        {result && (
          <button
            onClick={() => { setResult(null); setError(null); setInput('') }}
            className="font-mono text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Clear
          </button>
        )}
        <span className="font-mono text-[11px] text-text-dim">Cmd+Enter</span>
      </div>

      {/* Output area */}
      <div className="mt-6">
        {isAnalyzing && (
          <p className="font-mono text-xs text-text-muted animate-pulse">
            Analyzing against trust patterns...
          </p>
        )}

        {error && !isAnalyzing && (
          <div className="mt-4 border border-danger/20 bg-danger/[0.04] rounded-sm p-4">
            <p className="font-mono text-xs text-danger">⚠ {error}</p>
          </div>
        )}

        {/* Example prompts empty state */}
        {!result && !isAnalyzing && !error && (
          <div className="border border-white/[0.06] rounded-sm p-5 bg-surface">
            <p className="font-mono text-[10px] tracking-widest uppercase text-text-dim mb-3">
              Try these examples
            </p>
            <div className="space-y-2">
              {ANALYZER_EXAMPLES.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="w-full text-left font-mono text-xs text-text-muted hover:text-text-primary border border-white/[0.06] hover:border-accent/20 rounded-sm px-4 py-2.5 transition-all duration-150 flex items-center justify-between group"
                >
                  <span>"{example}"</span>
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="bg-surface border border-white/[0.06] rounded-sm p-5">
            <div className="font-mono text-[10px] tracking-wider uppercase text-accent mb-2">
              Pattern matched
            </div>
            <div className="text-base font-medium text-text-primary mb-2">
              {result.pattern}
            </div>
            <span className={['inline-block font-mono text-xs px-2 py-1 rounded-sm mb-4', verdictIsPositive ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'].join(' ')}>
              {result.verdict === 'DO' ? '✓ DO' : "✗ DON'T"}
            </span>
            <p className="text-sm text-text-muted leading-relaxed mb-3">{result.analysis}</p>
            <p className="text-sm text-text-primary leading-relaxed">{result.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function TrustLens() {
  const [openPatterns,  setOpenPatterns]  = useState(new Set())
  const [analyzerInput, setAnalyzerInput] = useState('')

  const allExpanded = openPatterns.size === PATTERNS.length

  const togglePattern = (id) => {
    setOpenPatterns(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (allExpanded) {
      setOpenPatterns(new Set())
    } else {
      setOpenPatterns(new Set(PATTERNS.map(p => p.id)))
    }
  }

  return (
    <div className="min-h-screen bg-base text-text-primary font-sans">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="px-5 md:px-8 xl:px-16 pt-10 pb-8 border-b border-white/[0.06]">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-dim mb-3 flex items-center gap-2">
              <span className="text-accent drop-shadow-[0_0_6px_#68FF7D]">●</span>
              TRUST LENS
            </div>
            <h1 className="text-3xl font-light tracking-tight text-text-primary max-w-xl">
              Design for AI trust in defensive cybersecurity
            </h1>
            <p className="text-sm text-text-muted font-light mt-2 max-w-lg leading-relaxed">
              Six evidence-based patterns for building AI interfaces analysts can trust, with a live analyzer to audit your design decisions.
            </p>
          </div>
          <div className="font-mono text-[10px] text-text-dim text-right hidden md:block mt-1 leading-relaxed">
            <div>Google PAIR · Microsoft HAX</div>
            <div>IBM Carbon · WEF Trust Stack</div>
          </div>
        </div>
      </header>

      {/* ── MAIN SPLIT PANEL ───────────────────────────────────── */}
      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-160px)]">

        {/* LEFT: Trust Patterns */}
        <div className="lg:w-[55%] border-r border-white/[0.06] px-5 md:px-8 xl:px-12 py-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-dim mb-1">
                Design patterns
              </div>
              <h2 className="text-base font-medium text-text-primary">
                Trust patterns
              </h2>
            </div>
            <button
              onClick={toggleAll}
              className="font-mono text-[11px] text-accent hover:opacity-70 transition-opacity"
            >
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          {PATTERNS.map((pattern, index) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              index={index}
              isOpen={openPatterns.has(pattern.id)}
              onToggle={() => togglePattern(pattern.id)}
            />
          ))}
        </div>

        {/* RIGHT: Trust Analyzer */}
        <div className="lg:w-[45%] px-5 md:px-8 xl:px-12 py-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="mb-6">
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-dim mb-1">
              Live tool
            </div>
            <h2 className="text-base font-medium text-text-primary flex items-center gap-2">
              Trust analyzer
              <span className="border border-accent text-accent font-mono text-[10px] px-1.5 py-0.5 rounded-sm">AI</span>
            </h2>
            <p className="text-sm text-text-muted mt-1 leading-relaxed">
              Describe a UI decision. Get an instant audit against all six trust patterns.
            </p>
          </div>
          <Analyzer input={analyzerInput} setInput={setAnalyzerInput} />
        </div>

      </main>

      {/* ── KNOWLEDGE BASE ─────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] px-5 md:px-8 xl:px-16 py-12">
        <div className="mb-8">
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-dim mb-1">
            Knowledge base
          </div>
          <h2 className="text-base font-medium text-text-primary">
            Grounded in
          </h2>
          <p className="text-sm text-text-muted mt-1">
            The four frameworks these patterns are derived from.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {FRAMEWORKS.map((fw, i) => (
            <a
              key={i}
              href={fw.url}
              target="_blank"
              rel="noopener"
              className="bg-surface border border-white/[0.06] rounded-sm p-5 hover:border-accent/20 transition-colors duration-150 group"
            >
              <div className="font-mono text-[10px] tracking-wider uppercase text-text-dim mb-2">
                {fw.org}
              </div>
              <div className="text-sm font-medium text-text-primary mb-2 group-hover:text-accent transition-colors">
                {fw.name}
              </div>
              <div className="text-xs text-[#b0b0b0] leading-relaxed mb-3">
                {fw.covers}
              </div>
              <div className="font-mono text-[11px] text-accent">
                View →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-5 md:px-8 xl:px-16 py-6 flex justify-between items-center">
        <span className="font-mono text-xs text-text-muted">Built by Adam Goddenyu, AI-Native Senior Product Designer</span>
        <span className="font-mono text-xs text-text-muted">Built with Claude Code + Cursor</span>
      </footer>

    </div>
  )
}
