import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

export default function Home() {
  const [votes, setVotes] = useState({ yes: 0, no: 0 })
  const [voted, setVoted] = useState(false)
  const [mode, setMode] = useState(null)
  const [loading, setLoading] = useState(false)
const [byCountry, setByCountry] = useState({})
  
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
setByCountry(data.byCountry || {})
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
<meta property="og:image" content="https://res.cloudinary.com/debacnwvw/image/upload/v1776705089/TrumpOG-1_p1izdv.jpg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url" content="https://www.doyouliketrump.com"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://res.cloudinary.com/debacnwvw/image/upload/v1776705089/TrumpOG-1_p1izdv.jpg"/>
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
              <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, color: '#aaa', marginBottom: 32 }}>
          left until the end of term · Jan 20, 2029
        </p>

{/* Character video */}
      <div style={{ marginBottom: 16, width: 280, height: 380, position: 'relative' }}>
        <video
          key={mode}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: 280, height: 380, objectFit: 'contain' }}
        >
          <source src={
            mode === 'yes'
              ? 'https://res.cloudinary.com/debacnwvw/video/upload/v1776696961/Trump-yes-black_keyeth.mp4'
              : mode === 'no'
              ? 'https://res.cloudinary.com/debacnwvw/video/upload/v1776696961/Trump-no-black_uf6qbb.mp4'
              : 'https://res.cloudinary.com/debacnwvw/video/upload/v1776697808/Trump-still-black_y49fye.mp4'
          } type="video/mp4"/>
        </video>
      </div>


        <p style={{ fontSize: 14, color: '#888', marginBottom: 20, minHeight: 20 }}>
          {voted
            ? mode === 'yes' ? 'Dance mode activated!' : 'The tears have spoken.'
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
          <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', marginTop: 8 }}>
            {total.toLocaleString()} votes cast worldwide
          </p>

          {voted && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
              <button
                onClick={() => {
                  const text = mode === 'yes'
                    ? `I voted YES on doyouliketrump.com 👼 ${yesPct}% of people agree! Cast your vote:`
                    : `I voted NO on doyouliketrump.com 😈 ${noPct}% of people agree! Cast your vote:`
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://www.doyouliketrump.com')}`, '_blank')
                }}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: '1.5px solid #1da1f2',
                  color: '#1da1f2', background: 'transparent', fontSize: 14,
                  fontWeight: 600, cursor: 'pointer'
                }}>
                Share on X
              </button>
              <button
                onClick={() => {
                  const url = 'https://www.doyouliketrump.com'
                  if (navigator.share) {
                    navigator.share({ title: 'Do you like Trump?', url })
                  } else {
                    navigator.clipboard.writeText(url)
                    alert('Link copied!')
                  }
                }}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: '1.5px solid #555',
                  color: '#aaa', background: 'transparent', fontSize: 14,
                  fontWeight: 600, cursor: 'pointer'
                }}>
                Copy link
              </button>
            </div>
          )}
        </div>
 {/* World Map */}
        <div style={{ width: '100%', maxWidth: 700, marginTop: 40 }}>
  <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
    Votes by country
  </p>
  <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: '100%', height: 'auto' }}>
    <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
      {({ geographies }) =>
        geographies.map(geo => {
          const code = geo.properties.iso_a2
          const counts = byCountry[code]
          const total = counts ? counts.yes + counts.no : 0
          const yesPct = total ? counts.yes / total : 0
          let fill = '#1a1a1a'
          if (total > 0) {
            if (yesPct >= 0.6) fill = '#2e7d32'
            else if (yesPct <= 0.4) fill = '#c62828'
            else fill = '#f9a825'
          }
          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={fill}
              stroke="#333"
              strokeWidth={0.5}
              style={{
                default: { outline: 'none' },
                hover: { outline: 'none', opacity: 0.8 },
                pressed: { outline: 'none' }
              }}
            />
          )
        })
      }
    </Geographies>
  </ComposableMap>
  <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
    <span style={{ fontSize: 11, color: '#2e7d32' }}>■ Mostly YES</span>
    <span style={{ fontSize: 11, color: '#f9a825' }}>■ Mixed</span>
    <span style={{ fontSize: 11, color: '#c62828' }}>■ Mostly NO</span>
    <span style={{ fontSize: 11, color: '#333' }}>■ No votes yet</span>
  </div>
</div>
        )}
      </main>
    </>
  )
}
