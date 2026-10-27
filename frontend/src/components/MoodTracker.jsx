import React, { useMemo } from 'react';

export default function MoodTracker({ moods }) {
  const moods_emojis = ['😢', '😟', '😐', '🙂', '😊', '😃', '😄', '😍', '🤩', '😍'];

  const stats = useMemo(() => {
    if (moods.length === 0) return { avg: 0, latest: null };

    const avg = (moods.reduce((sum, m) => sum + m.mood, 0) / moods.length).toFixed(1);
    const latest = moods[0];

    return { avg, latest };
  }, [moods]);

  const recentMoods = moods.slice(0, 7);

  return (
    <div className="mood-tracker">
      {/* Latest Mood */}
      {stats.latest && (
        <div className="mood-card">
          <h3>Eng So'nggi Ko'ngil Holati</h3>
          <div className="mood-emoji">
            {moods_emojis[stats.latest.mood - 1] || '😐'}
          </div>
          <div className="mood-value">{stats.latest.mood}/10</div>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {new Date(stats.latest.created_at).toLocaleDateString('uz-UZ')}
          </p>
        </div>
      )}

      {/* Average */}
      {stats.avg > 0 && (
        <div className="mood-card">
          <h3>O'rtacha Ko'ngil Holati</h3>
          <div className="mood-value" style={{ color: '#1E88E5' }}>
            {stats.avg}/10
          </div>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {moods.length} ta ma'lumot bo'yicha
          </p>
        </div>
      )}

      {/* Trend */}
      <div className="mood-card">
        <h3>Oxirgi 7 Kun Trendi</h3>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1rem 0' }}>
          {recentMoods.map((mood, idx) => (
            <div
              key={idx}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: `hsl(${120 + mood.mood * 4}, 70%, 50%)`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {mood.mood}
            </div>
          ))}
        </div>
        <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
          Ko'ngil holati dinamikasi
        </p>
      </div>
    </div>
  );
}
