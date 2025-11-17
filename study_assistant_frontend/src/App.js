import React, { useState, useEffect } from 'react';
import './App.css';
import Chat from './components/Chat';

// PUBLIC_INTERFACE
function App() {
  /**
   * App root renders a simple navbar with theme toggle and the Chat component centered below.
   * Applies the theme to the document element via data-theme attribute.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark themes */
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <nav className="navbar" role="navigation" aria-label="Top navigation">
        <div className="brand">Academic Query Assistant</div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </nav>

      <main className="chat-page">
        <Chat />
      </main>

      <div className="footer-note">AI answers are generated and may contain inaccuracies. Verify critical information.</div>
    </div>
  );
}

export default App;
