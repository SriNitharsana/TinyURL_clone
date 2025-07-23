import React, { useState } from 'react';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiryMinutes, setExpiryMinutes] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [error, setError] = useState('');

  const handleShorten = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://tinyurl-clone-5ml3.onrender.com/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalUrl,
          customCode: customCode.trim() || undefined,
          expiresInMinutes: expiryMinutes ? parseInt(expiryMinutes) : undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setShortenedUrl(null);
      } else {
        setShortenedUrl(data);
        setError('');
      }
    } catch (err) {
      setError('Failed to connect to server');
      setShortenedUrl(null);
    }
  };

  const formatExpiry = (expiry) => {
    const expiryDate = new Date(expiry);
    const now = new Date();
    const diffMs = expiryDate - now;

    if (diffMs <= 0) return "Expired";

    const mins = Math.ceil(diffMs / 60000);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    if (hrs > 0) return `${hrs} hour(s) ${remainingMins} minute(s)`;
    return `${remainingMins} minute(s)`;
  };

  return (
    <div className="App">
      <h1>TinyURL</h1>
      <form onSubmit={handleShorten}>
        <input
          type="text"
          placeholder="Enter original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom short code (optional)"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Expiry in minutes (optional)"
          value={expiryMinutes}
          onChange={(e) => setExpiryMinutes(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shortenedUrl && (
        <div className="result">
          <p><strong>Original URL:</strong> {shortenedUrl.originalUrl}</p>
          <p><strong>Short URL:</strong> <a href={shortenedUrl.shortUrl} target="_blank" rel="noreferrer">{shortenedUrl.shortUrl}</a></p>
          <p><strong>Expires In:</strong> {shortenedUrl.expiresAt ? formatExpiry(shortenedUrl.expiresAt) : 'No Expiry'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
