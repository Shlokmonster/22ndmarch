import { useState, useEffect } from 'react';
import './App.css';
import SurpriseForm from './SurpriseForm';

// Set your target date here
const TARGET_DATE = new Date('2026-03-22T00:00:00');

function getTimeLeft() {
  const now = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  if (showForm) {
    return <SurpriseForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="page-bg">
      <div className="sparkle sparkle-1" />
      <div className="sparkle sparkle-2" />
      <div className="sparkle sparkle-3" />
      <div className="sparkle sparkle-4" />
      <div className="sparkle sparkle-5" />

      <div className="card">
        <h1 className="card-title">
         If I Was Choosing Something Just For You, Bby…<br />
          <span className="gift-box">🎁</span>
        </h1>
        <p className="card-subtitle">A little space to know just about you  </p>

        <div className="countdown-row">
          <div className="countdown-unit">
            <span className="countdown-number">{pad(timeLeft.days)}</span>
            <span className="countdown-label">DAYS</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-number">{pad(timeLeft.hours)}</span>
            <span className="countdown-label">HOURS</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-number">{pad(timeLeft.minutes)}</span>
            <span className="countdown-label">MINUTES</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-number">{pad(timeLeft.seconds)}</span>
            <span className="countdown-label">SECONDS</span>
          </div>
        </div>

        <button className="surprise-btn" onClick={() => setShowForm(true)}>
         Begin 💝
        </button>
      </div>
    </div>
  );
}
