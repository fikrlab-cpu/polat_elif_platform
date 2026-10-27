import React from 'react';

export default function Timeline({ messages }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="timeline">
      {messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>Hozircha xabar yo'q</p>
          <p style={{ fontSize: '0.9rem' }}>Telegram bot'dan /post bilan boshlang</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="message-card">
            <div className="message-header">
              <span style={{ fontWeight: 'bold' }}>💭 Message #{msg.id}</span>
              <span>{formatDate(msg.created_at)}</span>
            </div>
            <div className="message-text">{msg.text}</div>
            <div className="message-meta">
              <span>User: {msg.user_id}</span>
              <span>Type: {msg.type}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
