import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'

export default function Home() {
  const [votes, setVotes] = useState({ yes: 0, no: 0 })
  const [voted, setVoted] = useState(false)
  const [mode, setMode] = useState(null)
  const [loading, setLoading] = useState(false)
  const svgRef = useRef(null)

  useEffect(() => {
    fetchVotes()
    const stored = localStorage.getItem('trump_voted')
    if (stored) {
      setVoted(true)
      setMode(stored)
    }
  }, [])

  async function fetchVotes() {
    const res = await fetch('/api/vote')
    const data = await res.json()
    setVotes({ yes: data.yes, no: data.no })
  }

  async function castVote(type) {
    if (voted || loading) return
    setLoading(true)
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote: type })
    })
    if (res.ok) {
      setMode(type)
      setVoted(true)
      localStorage.setItem('trump_voted', type)
      await fetchVotes()
    }
    setLoading(false)
  }

  const total = votes.yes + votes.no
  const yesPct = total ? Math.round(votes.yes / total * 100) : 0
  const noPct = total ? 100 - yesPct : 0

  const end = new Date('2029-01-20T12:00:00')
  const [timer, setTimer] = useState({})
  useEffect(() => {
    function tick() {
      const diff = end - new Date()
      if (diff <= 0) return
      setTimer({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <Head>
        <title>Do you like Trump?</title>
        <meta name="description" content="The world votes. Do you like Trump? Cast your vote now." />
        <meta property="og:title" content="Do you like Trump?" />
        <meta property="og:description" content="Cast your vote. See how the world feels." />
      </Head>

      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: 'system-ui, sans-serif',
        background: '#0a0a0a',
        color: '#fff'
      }}>

        <p style={{ fontSize: 13, letterSpacing: '0.12em', color: '#666', textTransform: 'uppercase', marginBottom: 8 }}>
          doyouliketrump.com
        </p>

        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
          Do you like Trump?
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
          One click. Your verdict. The world watches.
        </p>

        {/* Timer */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
          {[['days', timer.days], ['hours', timer.hours], ['mins', timer.mins], ['secs', timer.secs]].map(([label, val]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.1, color: '#fff' }}>
                {String(val ?? '—').padStart(2, '0')}
              </div>
              <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#444', marginBottom: 32 }}>
          days until end of term · Jan 20, 2029
        </p>

        {/* Character SVG */}
        <div style={{ marginBottom: 16 }}>
          <svg ref={svgRef} viewBox="0 0 180 230" width="180" height="230"
            style={{ overflow: 'visible', transition: 'transform 0.3s' }}>

            {/* Wings */}
            {mode === 'yes' && <>
              <path d="M60 120 Q20 95 10 130 Q30 140 60 135 Z" fill="#ffe082" stroke="#f9a825" strokeWidth="1"/>
              <path d="M60 130 Q15 120 8 158 Q35 162 62 150 Z" fill="#fff176" stroke="#f9a825" strokeWidth="1"/>
              <path d="M62 140 Q20 145 12 180 Q40 180 64 162 Z" fill="#ffe082" stroke="#f9a825" strokeWidth="1"/>
              <path d="M120 120 Q160 95 170 130 Q150 140 120 135 Z" fill="#ffe082" stroke="#f9a825" strokeWidth="1"/>
              <path d="M120 130 Q165 120 172 158 Q145 162 118 150 Z" fill="#fff176" stroke="#f9a825" strokeWidth="1"/>
              <path d="M118 140 Q160 145 168 180 Q140 180 116 162 Z" fill="#ffe082" stroke="#f9a825" strokeWidth="1"/>
              <ellipse cx="90" cy="22" rx="28" ry="7" fill="none" stroke="#f9a825" strokeWidth="3" strokeDasharray="4 2"/>
            </>}

            {/* Horns */}
            {mode === 'no' && <>
              <polygon points="70,42 62,10 80,40" fill="#b71c1c" stroke="#7f0000" strokeWidth="1"/>
              <polygon points="110,42 118,10 100,40" fill="#b71c1c" stroke="#7f0000" strokeWidth="1"/>
            </>}

            {/* Body */}
            <rect x="55" y="130" width="70" height="80" rx="8" fill="#1a237e"/>
            <polygon points="90,135 84,145 90,195 96,145" fill="#e53935"/>
            <polygon points="78,132 90,148 102,132 95,130 90,140 85,130" fill="#fff"/>
            <polygon points="55,132 78,132 85,130 55,150" fill="#283593"/>
            <polygon points="125,132 102,132 95,130 125,150" fill="#283593"/>
            <rect x="63" y="205" width="22" height="20" rx="4" fill="#1a237e"/>
            <rect x="95" y="205" width="22" height="20" rx="4" fill="#1a237e"/>
            <rect x="59" y="220" width="28" height="10" rx="4" fill="#111"/>
            <rect x="91" y="220" width="28" height="10" rx="4" fill="#111"/>

            {/* Arms */}
            {mode === 'yes' ? <>
              <rect x="25" y="110" width="28" height="14" rx="7" fill="#1a237e" transform="rotate(-50 39 117)"/>
              <rect x="127" y="110" width="28" height="14" rx="7" fill="#1a237e" transform="rotate(50 141 117)"/>
              <ellipse cx="30" cy="100" rx="9" ry="8" fill="#FDDBB4"/>
              <ellipse cx="150" cy="100" rx="9" ry="8" fill="#FDDBB4"/>
            </> : <>
              <rect x="30" y="133" width="28" height="14" rx="7" fill="#1a237e" transform="rotate(20 44 140)"/>
              <rect x="122" y="133" width="28" height="14" rx="7" fill="#1a237e" transform="rotate(-20 136 140)"/>
              <ellipse cx="36" cy="152" rx="9" ry="8" fill="#FDDBB4"/>
              <ellipse cx="144" cy="152" rx="9" ry="8" fill="#FDDBB4"/>
            </>}

            {/* Neck + Head */}
            <rect x="81" y="108" width="18" height="22" rx="4" fill="#FDDBB4"/>
            <ellipse cx="90" cy="88" rx="34" ry="36" fill="#FDDBB4"/>
            <path d="M58 75 Q62 45 90 42 Q118 45 122 75 Q112 58 90 56 Q68 58 58 75 Z" fill="#D4890A"/>
            <path d="M56 72 Q52 60 58 52 Q63 48 65 55 Q60 62 60 72 Z" fill="#C07800"/>
            <ellipse cx="56" cy="90" rx="7" ry="9" fill="#FDDBB4"/>
            <ellipse cx="124" cy="90" rx="7" ry="9" fill="#FDDBB4"/>

            {/* Eyes */}
            {mode === 'yes' ? <>
              <path d="M70 83 Q76 77 82 83" stroke="#3e2723" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M98 83 Q104 77 110 83" stroke="#3e2723" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </> : mode === 'no' ? <>
              <ellipse cx="76" cy="86" rx="6" ry="6" fill="white"/>
              <ellipse cx="104" cy="86" rx="6" ry="6" fill="white"/>
              <circle cx="76" cy="87" r="3.5" fill="#3e2723"/>
              <circle cx="104" cy="87" r="3.5" fill="#3e2723"/>
              <path d="M69 78 Q76 75 83 78" stroke="#7b3f00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M97 78 Q104 75 111 78" stroke="#7b3f00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </> : <>
              <ellipse cx="76" cy="84" rx="6" ry="6.5" fill="white"/>
              <ellipse cx="104" cy="84" rx="6" ry="6.5" fill="white"/>
              <circle cx="77" cy="85" r="3.5" fill="#3e2723"/>
              <circle cx="105" cy="85" r="3.5" fill="#3e2723"/>
            </>}

            <ellipse cx="90" cy="93" rx="5" ry="4" fill="#e8a87c"/>

            {/* Mouth */}
            {mode === 'yes'
              ? <path d="M78 101 Q90 112 102 101" stroke="#8d4004" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              : mode === 'no'
              ? <path d="M78 107 Q90 100 102 107" stroke="#8d4004" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              : <path d="M80 103 Q90 107 100 103" stroke="#8d4004" strokeWidth="2" fill="none" strokeLinecap="round"/>
            }
          </svg>
        </div>

        <p style={{ fontSize: 14, color: '#888', marginBottom: 20, minHeight: 20 }}>
          {voted
            ? mode === 'yes' ? 'Angel mode activated!' : 'The horns have spoken.'
            : 'Cast your vote below'}
        </p>

        {/* Vote buttons */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          <button
            onClick={() => castVote('yes')}
            disabled={voted || loading}
            style={{
              width: 120, height: 54, borderRadius: 12,
              border: '1.5px solid #2e7d32', color: '#4caf50',
              background: mode === 'yes' ? 'rgba(46,125,50,0.15)' : 'transparent',
              fontSize: 18, fontWeight: 600, cursor: voted ? 'default' : 'pointer',
              opacity: voted && mode !== 'yes' ? 0.4 : 1, transition: 'all 0.2s'
            }}>
            👍 YES
          </button>
          <button
            onClick={() => castVote('no')}
            disabled={voted || loading}
            style={{
              width: 120, height: 54, borderRadius: 12,
              border: '1.5px solid #c62828', color: '#ef5350',
              background: mode === 'no' ? 'rgba(183,28,28,0.15)' : 'transparent',
              fontSize: 18, fontWeight: 600, cursor: voted ? 'default' : 'pointer',
              opacity: voted && mode !== 'no' ? 0.4 : 1, transition: 'all 0.2s'
            }}>
            👎 NO
          </button>
        </div>

        {/* Results bars */}
        <div style={{ width: '100%', maxWidth: 320 }}>
          {[['YES', yesPct, '#2e7d32', '#4caf50'], ['NO', noPct, '#c62828', '#ef5350']].map(([label, pct, border, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, width: 32, textAlign: 'right', color }}>{label}</div>
              <div style={{ flex: 1, height: 10, background: '#1a1a1a', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }}/>
              </div>
              <div style={{ fontSize: 13, color: '#666', width: 36 }}>{pct}%</div>
            </div>
          ))}
          <p style={{ fontSize: 12, color: '#444', textAlign: 'center', marginTop: 8 }}>
            {total.toLocaleString()} votes cast worldwide
          </p>
        </div>
      </main>
    </>
  )
}
