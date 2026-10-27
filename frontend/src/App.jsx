import React, { useState, useEffect } from 'react';
import './App.css';
import Timeline from './components/Timeline';
import MoodTracker from './components/MoodTracker';
import Distance from './components/Distance';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [moods, setMoods] = useState([]);
  const [distance, setDistance] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch messages
      const msgRes = await fetch('http://localhost:5000/api/messages');
      const msgData = await msgRes.json();
      setMessages(msgData);

      // Fetch moods
      const moodRes = await fetch('http://localhost:5000/api/moods');
      const moodData = await moodRes.json();
      setMoods(moodData);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>💕 Po'lat va Elif</h1>
          <p>Sevgi va xotiralari platformasi</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            📝 Timeline
          </button>
          <button
            className={`tab ${activeTab === 'mood' ? 'active' : ''}`}
            onClick={() => setActiveTab('mood')}
          >
            😊 Mood
          </button>
          <button
            className={`tab ${activeTab === 'distance' ? 'active' : ''}`}
            onClick={() => setActiveTab('distance')}
          >
            📍 Distance
          </button>
        </div>

        {/* Content */}
        <div className="content">
          {loading ? (
            <div className="loading">⏳ Yuklanmoqda...</div>
          ) : (
            <>
              {activeTab === 'timeline' && <Timeline messages={messages} />}
              {activeTab === 'mood' && <MoodTracker moods={moods} />}
              {activeTab === 'distance' && <Distance />}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>🤖 Telegram Bot: @PolatElifBot</p>
        <p>💕 Birgalikda qurilgan - Oct 27, 2026</p>
      </footer>
    </div>
  );
}
