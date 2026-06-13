const STABLE_STOCKS = ['Coca-Cola', 'Johnson & Johnson', 'Procter & Gamble', 'Walmart', 'Berkshire Hathaway', 'Asian Paints', 'Nestle India', 'Hindustan Unilever']
const INDIAN_STOCKS = ['Infosys', 'TCS', 'Wipro', 'HCL Tech', 'Reliance', 'HDFC Bank', 'Zomato', 'Paytm', 'Adani Enterprises', 'Yes Bank']
const US_STABLE = ['Apple', 'Microsoft', 'Google', 'Amazon', 'Netflix']
const HIGH_VOLATILITY = ['Tesla', 'Nvidia', 'GameStop', 'AMC', 'Coinbase', 'Rivian', 'Palantir']
const DANCE_STYLES = ['hip-hop', 'ballet', 'classical', 'robot', 'breakdance']

const C = {
  cardBg: '#111118',
  border: '#1e1e2e',
  accent: '#00ff88',
  subText: '#666',
  inputBg: '#0a0a0f',
  inputText: '#ccc'
}

export default function Controls({
  company,
  setCompany,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  danceStyle,
  setDanceStyle,
  onSubmit,
  isLoading
}) {
  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${C.border}`,
      borderLeft: '3px solid #00ff88',
      borderRadius: 12,
      padding: 24
    }}>
      <form onSubmit={onSubmit}>
        <p style={{
          color: C.accent,
          fontFamily: "'Orbitron', monospace",
          fontSize: 11,
          letterSpacing: 4,
          marginBottom: 16,
          textTransform: 'uppercase'
        }}>CONFIGURE</p>

        {/* Stock Dropdown */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            color: C.subText,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>STOCK</label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: C.inputBg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              color: C.inputText,
              fontFamily: 'inherit',
              fontSize: 14,
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = C.accent}
            onBlur={(e) => e.target.style.borderColor = C.border}
          >
            <optgroup label="Stable — Low BPM">
              {STABLE_STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
            </optgroup>
            <optgroup label="Indian Markets">
              {INDIAN_STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
            </optgroup>
            <optgroup label="US Stable">
              {US_STABLE.map(s => <option key={s} value={s}>{s}</option>)}
            </optgroup>
            <optgroup label="High Volatility — High BPM">
              {HIGH_VOLATILITY.map(s => <option key={s} value={s}>{s}</option>)}
            </optgroup>
          </select>
        </div>

        {/* Start Date */}
        <div style={{ width: '100%', marginBottom: 12 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            color: C.subText,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>START DATE</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              background: C.inputBg,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.inputText,
              fontFamily: 'inherit',
              fontSize: 12,
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = C.accent}
            onBlur={(e) => e.target.style.borderColor = C.border}
          />
        </div>

        {/* End Date */}
        <div style={{ width: '100%', marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            color: C.subText,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>END DATE</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              background: C.inputBg,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.inputText,
              fontFamily: 'inherit',
              fontSize: 12,
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = C.accent}
            onBlur={(e) => e.target.style.borderColor = C.border}
          />
        </div>

        {/* Dance Style */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            color: C.subText,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>DANCE STYLE</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            width: '100%'
          }}>
            {DANCE_STYLES.map(style => (
              <button
                key={style}
                type="button"
                onClick={() => setDanceStyle(style)}
                style={{
                  width: '100%',
                  padding: '8px 4px',
                  background: C.inputBg,
                  border: danceStyle === style
                    ? `1px solid ${C.accent}`
                    : `1px solid ${C.border}`,
                  borderRadius: 6,
                  color: danceStyle === style ? C.accent : C.inputText,
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  ...(style === 'breakdance' && { gridColumn: '1 / -1' })
                }}
              >{style}</button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: 14,
            background: C.accent,
            color: '#000',
            border: 'none',
            borderRadius: 6,
            fontFamily: "'Orbitron', monospace",
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 20px rgba(0,255,136,0.4)',
            opacity: isLoading ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          {isLoading ? 'GENERATING...' : 'GENERATE DANCE'}
        </button>
      </form>
    </div>
  )
}