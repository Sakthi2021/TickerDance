const INDIAN_STOCKS = ['Infosys', 'TCS', 'Wipro', 'HCL Tech', 'Reliance', 'HDFC Bank', 'Zomato']
const US_STOCKS = ['Apple', 'Tesla', 'Microsoft', 'Google', 'Amazon', 'Netflix']
const DANCE_STYLES = ['hip-hop', 'ballet', 'classical', 'robot', 'breakdance']

export default function Controls({
  company,
  setCompany,
  companyA,
  setCompanyA,
  companyB,
  setCompanyB,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startDateA,
  setStartDateA,
  endDateA,
  setEndDateA,
  startDateB,
  setStartDateB,
  endDateB,
  setEndDateB,
  danceStyle,
  setDanceStyle,
  onSubmit,
  isLoading,
  isBattle
}) {
  const compA = isBattle ? companyA : company
  const setCompA = isBattle ? setCompanyA : setCompany
  const compB = isBattle ? companyB : null
  const setCompB = isBattle ? setCompanyB : null

  const sdA = isBattle ? startDateA : startDate
  const setSdA = isBattle ? setStartDateA : setStartDate
  const edA = isBattle ? endDateA : endDate
  const setEdA = isBattle ? setEndDateA : setEndDate

  const sdB = isBattle ? startDateB : null
  const setSdB = isBattle ? setStartDateB : null
  const edB = isBattle ? endDateB : null
  const setEdB = isBattle ? setEndDateB : null

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
          }}>Stock A</label>
          <select
            value={compA}
            onChange={(e) => setCompA(e.target.value)}
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
            <optgroup label="Indian Stocks">
              {INDIAN_STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
            </optgroup>
            <optgroup label="US Stocks">
              {US_STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
            </optgroup>
          </select>
        </div>

        {isBattle && (
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: '#666',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}>Stock B</label>
            <select
              value={compB}
              onChange={(e) => setCompB(e.target.value)}
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
              <optgroup label="Indian Stocks">
                {INDIAN_STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
              </optgroup>
              <optgroup label="US Stocks">
                {US_STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
              </optgroup>
            </select>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: '#666',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}>{isBattle ? 'Start Date A' : 'Start Date'}</label>
            <input
              type="date"
              value={sdA}
              onChange={(e) => setSdA(e.target.value)}
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
            }}>{isBattle ? 'End Date A' : 'End Date'}</label>
            <input
              type="date"
              value={edA}
              onChange={(e) => setEdA(e.target.value)}
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

        {isBattle && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                color: '#666',
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase'
              }}>Start Date B</label>
              <input
                type="date"
                value={sdB}
                onChange={(e) => setSdB(e.target.value)}
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
              }}>End Date B</label>
              <input
                type="date"
                value={edB}
                onChange={(e) => setEdB(e.target.value)}
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
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            color: '#666',
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>Dance Style</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {DANCE_STYLES.map(style => (
              <button
                key={style}
                type="button"
                onClick={() => setDanceStyle(style)}
                style={{
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
                  transition: 'all 0.2s'
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

        {!isBattle && (
          <button
            type="button"
            onClick={() => {}}
            style={{
              width: '100%',
              padding: 14,
              marginTop: 12,
              background: 'transparent',
              border: '1px solid #333',
              color: '#666',
              fontFamily: "'Orbitron', monospace",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: 'uppercase',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = '#00ff88'; e.target.style.color = '#00ff88' }}
            onMouseLeave={(e) => { e.target.style.borderColor = '#333'; e.target.style.color = '#666' }}
          >BATTLE MODE</button>
        )}
      </form>
    </div>
  )
}