import React, { useState } from 'react';

export default function Distance() {
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateDistance = async () => {
    setLoading(true);
    try {
      // Placeholder - real calculation happens on bot with /distance command
      setDistance({
        km: 250,
        polat: { city: 'Tashkent', lat: '37.42°N', lon: '69.28°E' },
        elif: { city: 'Ohangaron', lat: '40.10°N', lon: '71.60°E' },
        drive: '4h 30min',
        flight: '1h 30min',
        updated: new Date().toLocaleTimeString('uz-UZ'),
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {distance ? (
        <div className="distance-card">
          <h2>📍 Oramizda Masofa</h2>
          <div className="distance-value">{distance.km} KM</div>

          <div className="distance-locations">
            <div className="location">
              <div className="location-icon">🗺️</div>
              <div className="location-name">{distance.polat.city}</div>
              <div className="location-status">Po'lat</div>
            </div>
            <div className="arrow">↔️</div>
            <div className="location">
              <div className="location-icon">📍</div>
              <div className="location-name">{distance.elif.city}</div>
              <div className="location-status">Elif</div>
            </div>
          </div>

          <div style={{ margin: '2rem 0', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>🚗 Avtomobil:</strong> {distance.drive}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>✈️ Samolyot:</strong> {distance.flight}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#999' }}>
              Oxirgi yangilash: {distance.updated}
            </p>
          </div>

          <button
            onClick={calculateDistance}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#1E88E5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem',
            }}
          >
            🔄 Yangilash
          </button>
        </div>
      ) : (
        <div className="distance-card">
          <h2>📍 Oramizda Masofa</h2>
          <p style={{ color: '#666', margin: '2rem 0' }}>
            Masofa hisoblash uchun:
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            1. Telegram bot'ga yozing: <code>/location</code>
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            2. Ikkinchi tomon ham: <code>/location</code>
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
            3. Keyin: <code>/distance</code>
          </p>
          <button
            onClick={calculateDistance}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#E91E63',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '⏳ Hisobanmoqda...' : '🗺️ Masofa Hisoblash'}
          </button>
        </div>
      )}
    </div>
  );
}
