const STABLE_STOCKS = ['Coca-Cola', 'Johnson & Johnson', 'Procter & Gamble', 'Walmart', 'Berkshire Hathaway', 'Asian Paints', 'Nestle India', 'Hindustan Unilever']
const INDIAN_STOCKS = ['Infosys', 'TCS', 'Wipro', 'HCL Tech', 'Reliance', 'HDFC Bank', 'Zomato', 'Paytm', 'Adani Enterprises', 'Yes Bank']
const US_STABLE = ['Apple', 'Microsoft', 'Google', 'Amazon', 'Netflix']
const HIGH_VOLATILITY = ['Tesla', 'Nvidia', 'GameStop', 'AMC', 'Coinbase', 'Rivian', 'Palantir']
const DANCE_STYLES = ['hip-hop', 'ballet', 'classical', 'robot', 'breakdance']

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
    <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, padding: 24 }}>
      <form onSubmit={onSubmit}>
        <p style={{
          color: '#00ff88',
          fontFamily: "'Orbitron', monospace",
          fontSize: 11,
          letterSpacing: 4,
          marginBottom: 16,
          textTransform: 'uppercase'
        }}>CONFIGURE</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            color: '#666',
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>Stock</label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#0a0a0f',
              border: '1px solid #1e1e2e',
              borderRadius: 8,
              color: '#ccc',
              fontFamily: 'inherit',
              fontSize: 14,
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00ff88'}
            onBlur={(e) => e.target.style.borderColor = '#1e1e2e'}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: '#666',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#0a0a0f',
                border: '1px solid #1e1e2e',
                borderRadius: 8,
                color: '#ccc',
                fontFamily: 'inherit',
                fontSize: 14,
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = '#1e1e2e'}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: '#666',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#0a0a0f',
                border: '1px solid #1e1e2e',
                borderRadius: 8,
                color: '#ccc',
                fontFamily: 'inherit',
                fontSize: 14,
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = '#1e1e2e'}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            color: '#666',
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>Dance Style</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
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
                  background: '#0a0a0f',
                  border: danceStyle === style ? '1px solid #00ff88' : '1px solid #1e1e2e',
                  borderRadius: 6,
                  color: danceStyle === style ? '#00ff88' : '#ccc',
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

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: 14,
            background: '#00ff88',
            color: '#000',
            border: 'none',
            borderRadius: 6,
            fontFamily: "'Orbitron', monospace",
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 20px rgba(0,255,136,0.4)',
            opacity: isLoading ? 0.6 : 1
          }}
        >GENERATE DANCE</button>
      </form>
    </div>
  )
}