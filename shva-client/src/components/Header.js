import logo from '../assets/shva-logo.svg';

function Header({ language, setLanguage, t, onLogout, isAuthenticated }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <img src={logo} alt="Shva logo" className="topbar-logo" />

        <div className="topbar-actions">
          <div className="language-toggle">
            <button
              type="button"
              className={`lang-button ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              {t.english}
            </button>

            <button
              type="button"
              className={`lang-button ${language === 'he' ? 'active' : ''}`}
              onClick={() => setLanguage('he')}
            >
              {t.hebrew}
            </button>
          </div>

          {isAuthenticated && (
            <button type="button" className="logout-button" onClick={onLogout}>
              {t.logout}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
