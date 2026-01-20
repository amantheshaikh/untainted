import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Untainted - Food Intelligence API'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {/* Logo Icon */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: 20 }}
          >
             <circle cx="12" cy="12" r="10" stroke="#D65D26" strokeWidth="2" fill="none"/>
             <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4.07 13H8.07C8.42 16.3 10.02 19.4 12 21.36V13H19.93C19.38 10 17.47 7.54 14.85 6.27C15.59 7.74 16.03 9.34 16.14 11H7.86C7.97 9.34 8.41 7.74 9.15 6.27C6.53 7.54 4.62 10 4.07 13Z" fill="#D65D26"/>
          </svg>
          <div style={{ fontSize: 80, fontWeight: 800, color: '#1a1a1a' }}>Untainted</div>
        </div>
        <div style={{ fontSize: 40, color: '#666', maxWidth: 900, textAlign: 'center', lineHeight: 1.4 }}>
          Food Intelligence API for Safer, Smarter Decisions
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
