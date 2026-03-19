import { useState } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

const PATTERNS = [
  {
    id: 'trust-calibration',
    title: 'Confidence calibration',
    principle: 'UI layout, CTA, and tone must reflect AI certainty in real time.',
    do: "Show a muted 'Low confidence' badge and softer CTA when AI certainty is below 70%",
    dont: "Display the same bold 'Take action' button regardless of AI confidence score",
    frameworks: ['Google PAIR', 'IBM Carbon AI'],
  },
  {
    id: 'reasoning-visibility',
    title: 'Chain of thought',
    principle: 'Show reasoning as a visual chain. Each step links to raw evidence.',
    do: 'Render each reasoning step as a node in a visual chain with click-through to source data',
    dont: "Dump the AI's explanation as a wall of unstructured text with no links",
    frameworks: ['Microsoft HAX', 'WEF Trust Stack'],
  },
  {
    id: 'human-control',
    title: 'Human-in-the-loop override',
    principle: 'Correcting the AI is a first-class feature, not a settings page.',
    do: "Place a visible 'Override' button on every AI decision, with a simple correction flow",
    dont: "Hide correction behind Settings > Advanced > Feedback, analysts won't find it under pressure",
    frameworks: ['Google PAIR', 'Microsoft HAX'],
  },
  {
    id: 'evidence-trail',
    title: 'Auditability',
    principle: 'Every decision links to the data that caused it. One click, no new tab.',
    do: 'Inline expandable evidence panel: analyst sees the log line that triggered the alert',
    dont: "Link to a separate audit log page that breaks the analyst's flow and context",
    frameworks: ['IBM Carbon AI', 'WEF Trust Stack'],
  },
  {
    id: 'failure-design',
    title: 'Graceful failure',
    principle: 'The error state deserves the same design care as the happy path.',
    do: "Distinct 'AI unsure' state with a clear explanation and manual fallback option",
    dont: 'Show a generic error message or silently fall back to a default action',
    frameworks: ['Microsoft HAX', 'Google PAIR'],
  },
  {
    id: 'cognitive-load',
    title: 'Alert fatigue reduction',
    principle: 'Real threats must visually break the pattern. Everything else trains analysts to ignore alerts.',
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

// ── SVG Mockups (60px height, compact thumbnails) ─────────────────────────────

const DoVisual = ({ id }) => {
  if (id === 'trust-calibration') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="192" height="52" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      <rect x="12" y="12" width="110" height="15" rx="2" fill="rgba(255,180,0,0.12)" stroke="rgba(255,180,0,0.4)" strokeWidth="0.7"/>
      <text x="67" y="23" textAnchor="middle" fontSize="7.5" fill="#FFB400" fontFamily="monospace">Low confidence: 42%</text>
      <rect x="12" y="33" width="88" height="13" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7"/>
      <text x="56" y="43" textAnchor="middle" fontSize="7" fill="#949494" fontFamily="monospace">Review manually</text>
    </svg>
  )
  if (id === 'reasoning-visibility') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="8" y="18" width="44" height="22" rx="3" fill="#222" stroke="rgba(104,255,125,0.35)" strokeWidth="0.7"/>
      <text x="30" y="32" textAnchor="middle" fontSize="7" fill="#a8a8a8" fontFamily="monospace">Login</text>
      <line x1="52" y1="29" x2="66" y2="29" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7"/>
      <polygon points="66,26.5 71,29 66,31.5" fill="rgba(255,255,255,0.18)"/>
      <rect x="72" y="18" width="48" height="22" rx="3" fill="#222" stroke="rgba(104,255,125,0.35)" strokeWidth="0.7"/>
      <text x="96" y="32" textAnchor="middle" fontSize="7" fill="#a8a8a8" fontFamily="monospace">Escalate</text>
      <line x1="120" y1="29" x2="134" y2="29" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7"/>
      <polygon points="134,26.5 139,29 134,31.5" fill="rgba(255,255,255,0.18)"/>
      <rect x="140" y="18" width="52" height="22" rx="3" fill="#222" stroke="rgba(104,255,125,0.65)" strokeWidth="1"/>
      <text x="166" y="32" textAnchor="middle" fontSize="7" fill="#68FF7D" fontFamily="monospace">Verdict</text>
    </svg>
  )
  if (id === 'human-control') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="192" height="52" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      <rect x="12" y="12" width="52" height="12" rx="2" fill="rgba(255,107,107,0.14)" stroke="rgba(255,107,107,0.38)" strokeWidth="0.7"/>
      <text x="38" y="21.5" textAnchor="middle" fontSize="7" fill="#FF6B6B" fontFamily="monospace">HIGH RISK</text>
      <rect x="112" y="11" width="72" height="14" rx="2" fill="rgba(104,255,125,0.09)" stroke="rgba(104,255,125,0.45)" strokeWidth="0.7"/>
      <text x="148" y="21.5" textAnchor="middle" fontSize="7.5" fill="#68FF7D" fontFamily="monospace">Override →</text>
      <rect x="12" y="32" width="118" height="3.5" rx="1" fill="rgba(255,255,255,0.1)"/>
      <rect x="12" y="40" width="80" height="3.5" rx="1" fill="rgba(255,255,255,0.07)"/>
    </svg>
  )
  if (id === 'evidence-trail') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="12" width="192" height="36" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      <rect x="14" y="21" width="86" height="3.5" rx="1" fill="rgba(255,255,255,0.14)"/>
      <rect x="14" y="29" width="58" height="3.5" rx="1" fill="rgba(255,255,255,0.08)"/>
      <rect x="116" y="18" width="72" height="14" rx="2" fill="rgba(104,255,125,0.07)" stroke="rgba(104,255,125,0.32)" strokeWidth="0.7"/>
      <text x="152" y="28" textAnchor="middle" fontSize="7" fill="#68FF7D" fontFamily="monospace">Evidence ▾</text>
    </svg>
  )
  if (id === 'failure-design') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="2" width="192" height="56" rx="3" fill="rgba(255,180,0,0.04)" stroke="rgba(255,180,0,0.28)" strokeWidth="0.7"/>
      <rect x="12" y="9" width="64" height="12" rx="2" fill="rgba(255,180,0,0.14)" stroke="rgba(255,180,0,0.38)" strokeWidth="0.7"/>
      <text x="44" y="18.5" textAnchor="middle" fontSize="7.5" fill="#FFB400" fontFamily="monospace">AI unsure</text>
      <rect x="12" y="27" width="128" height="3.5" rx="1" fill="rgba(255,255,255,0.1)"/>
      <rect x="12" y="34" width="88" height="3.5" rx="1" fill="rgba(255,255,255,0.07)"/>
      <rect x="12" y="43" width="76" height="12" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7"/>
      <text x="50" y="52" textAnchor="middle" fontSize="7" fill="#a8a8a8" fontFamily="monospace">Review manually</text>
    </svg>
  )
  if (id === 'cognitive-load') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      {[3, 17, 31].map((y) => (
        <rect key={y} x="4" y={y} width="192" height="11" rx="2" fill="#1c1c1c" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
      ))}
      <rect x="4" y="45" width="192" height="13" rx="2" fill="rgba(255,107,107,0.11)" stroke="rgba(255,107,107,0.48)" strokeWidth="1"/>
      <text x="18" y="55" fontSize="7.5" fill="#FF6B6B" fontFamily="monospace" fontWeight="600">● CRITICAL THREAT</text>
    </svg>
  )
  return null
}

const DontVisual = ({ id }) => {
  if (id === 'trust-calibration') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="192" height="52" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      <rect x="12" y="20" width="92" height="18" rx="2" fill="#68FF7D"/>
      <text x="58" y="32.5" textAnchor="middle" fontSize="9" fill="#0f0f0f" fontFamily="monospace" fontWeight="600">Take action</text>
    </svg>
  )
  if (id === 'reasoning-visibility') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="192" height="52" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      {[11, 17, 23, 29, 35, 41].map((y, i) => (
        <rect key={i} x="14" y={y} width={90 + (i % 4) * 18} height="3.5" rx="1" fill="rgba(255,255,255,0.1)"/>
      ))}
    </svg>
  )
  if (id === 'human-control') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="192" height="52" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      <rect x="12" y="12" width="52" height="12" rx="2" fill="rgba(255,107,107,0.14)" stroke="rgba(255,107,107,0.38)" strokeWidth="0.7"/>
      <text x="38" y="21.5" textAnchor="middle" fontSize="7" fill="#FF6B6B" fontFamily="monospace">HIGH RISK</text>
      <circle cx="172" cy="19" r="1.8" fill="rgba(255,255,255,0.2)"/>
      <circle cx="180" cy="19" r="1.8" fill="rgba(255,255,255,0.2)"/>
      <circle cx="164" cy="19" r="1.8" fill="rgba(255,255,255,0.2)"/>
      <rect x="12" y="32" width="118" height="3.5" rx="1" fill="rgba(255,255,255,0.1)"/>
      <rect x="12" y="40" width="80" height="3.5" rx="1" fill="rgba(255,255,255,0.07)"/>
    </svg>
  )
  if (id === 'evidence-trail') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="12" width="192" height="36" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      <rect x="14" y="21" width="86" height="3.5" rx="1" fill="rgba(255,255,255,0.14)"/>
      <rect x="14" y="29" width="58" height="3.5" rx="1" fill="rgba(255,255,255,0.08)"/>
      <text x="162" y="28" textAnchor="middle" fontSize="7" fill="#757575" fontFamily="monospace">Audit log ↗</text>
    </svg>
  )
  if (id === 'failure-design') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      <rect x="4" y="2" width="192" height="56" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      <rect x="12" y="9" width="36" height="12" rx="2" fill="rgba(255,255,255,0.07)"/>
      <text x="30" y="18.5" textAnchor="middle" fontSize="7.5" fill="#757575" fontFamily="monospace">Error</text>
      <rect x="12" y="28" width="110" height="3.5" rx="1" fill="rgba(255,255,255,0.06)"/>
      <rect x="12" y="36" width="70" height="3.5" rx="1" fill="rgba(255,255,255,0.04)"/>
    </svg>
  )
  if (id === 'cognitive-load') return (
    <svg viewBox="0 0 200 60" className="w-full" fill="none" aria-hidden="true">
      {[3, 17, 31, 45].map((y) => (
        <g key={y}>
          <rect x="4" y={y} width="192" height="11" rx="2" fill="#1c1c1c" stroke="rgba(255,107,107,0.28)" strokeWidth="0.7"/>
          <text x="18" y={y + 8} fontSize="7" fill="#FF6B6B" fontFamily="monospace" opacity="0.55">● Alert</text>
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
      className="bg-surface border border-white/[0.06] rounded-sm mb-2 px-5 py-4 cursor-pointer hover:border-accent/20 transition-colors duration-150 opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
      onClick={onToggle}
      role="button"
      aria-expanded={isOpen}
    >
      {/* Collapsed row */}
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0 pr-4">
          <div className="text-sm font-medium text-text-primary">
            {pattern.title}
          </div>
          <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
            {pattern.principle}
          </div>
        </div>
        <div className={['text-accent ml-4 shrink-0 transition-transform duration-150 text-xs', isOpen ? 'rotate-180' : ''].join(' ')}>
          ▾
        </div>
      </div>

      {/* Expanded content */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <div className="grid grid-cols-2 gap-2 mb-4">

            {/* DO panel */}
            <div className="bg-accent/[0.04] border border-accent/20 rounded-sm p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-accent text-[10px]">✓</span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-accent">Do</span>
              </div>
              <div className="mb-2 opacity-80">
                <DoVisual id={pattern.id} />
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{pattern.do}</p>
            </div>

            {/* DON'T panel */}
            <div className="bg-danger/[0.04] border border-danger/20 rounded-sm p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-danger text-[10px]">✗</span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-danger">Don't</span>
              </div>
              <div className="mb-2 opacity-80">
                <DontVisual id={pattern.id} />
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{pattern.dont}</p>
            </div>
          </div>

          {/* Framework tags */}
          <div className="flex flex-wrap gap-1.5">
            {pattern.frameworks.map((fw) => (
              <span key={fw} className="font-mono text-[10px] border border-white/20 text-text-muted px-2 py-0.5 rounded-sm">
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
        placeholder="Describe a UI decision and get an instant audit against all six trust patterns. e.g. I'm showing AI confidence as a percentage in the alert card header"
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
          <div className="mb-5">
            <h2 className="text-base font-medium text-text-primary flex items-center gap-2">
              Trust analyzer
              <span className="border border-accent text-accent font-mono text-[10px] px-1.5 py-0.5 rounded-sm">AI</span>
            </h2>
          </div>
          <Analyzer input={analyzerInput} setInput={setAnalyzerInput} />
        </div>

      </main>

      {/* ── KNOWLEDGE BASE ─────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] px-5 md:px-8 xl:px-16 py-12">
        <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-muted mb-6">
          Knowledge base
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
