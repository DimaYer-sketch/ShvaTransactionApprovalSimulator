import { useEffect, useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SimulatorForm from './components/SimulatorForm';
import ApprovedTransactions from './components/ApprovedTransactions';
import LoginPanel from './components/LoginPanel';

import {
  submitTransaction,
  getApprovedTransactions,
  login,
} from './api/transactionsApi';

import { setToken, getToken, clearToken } from './api/apiClient';
import { translations } from './localization/translations';

import './App.css';

function normalizeTransaction(item) {
  return {
    id: item?.id ?? item?.Id ?? 0,
    region: item?.region ?? item?.Region ?? '',
    localTime: item?.localTime ?? item?.LocalTime ?? '',
    isApproved: item?.isApproved ?? item?.IsApproved ?? false,
  };
}

function App() {
  const [language, setLanguage] = useState('en');
  const [approvedTransactions, setApprovedTransactions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));

  const t = useMemo(
    () => translations[language] || translations.en,
    [language],
  );

  const handleLogout = useCallback(() => {
    clearToken();
    setApprovedTransactions([]);
    setIsAuthenticated(false);
  }, []);

  const loadApprovedTransactions = useCallback(async () => {
    try {
      const data = await getApprovedTransactions();
      const normalized = Array.isArray(data)
        ? data.map(normalizeTransaction)
        : [];

      setApprovedTransactions(normalized);
    } catch (error) {
      console.error('Failed to load approved transactions', error);

      if (error.message === 'Unauthorized') {
        handleLogout();
      }
    }
  }, [handleLogout]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadApprovedTransactions();
  }, [isAuthenticated, loadApprovedTransactions]);

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  async function handleLogin(username, password) {
    const result = await login(username, password);

    if (!result?.token) {
      throw new Error('Login failed');
    }

    setToken(result.token);
    setIsAuthenticated(true);
  }

  async function handleSimulation(region, time) {
    try {
      setIsSubmitting(true);

      const result = await submitTransaction(region, time);
      const normalizedResult = normalizeTransaction(result);

      await loadApprovedTransactions();

      if (normalizedResult.isApproved) {
        return {
          success: true,
          transaction: normalizedResult,
        };
      }

      return {
        success: false,
        error: t.simulator.errors.rejected,
      };
    } catch (error) {
      console.error('Failed to submit transaction', error);

      if (error.message === 'Unauthorized') {
        handleLogout();

        return {
          success: false,
          error: t.simulator.errors.sessionExpired,
        };
      }

      return {
        success: false,
        error: t.simulator.errors.requestFailed,
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  const header = (
    <Header
      language={language}
      setLanguage={setLanguage}
      t={t.header}
      onLogout={handleLogout}
      isAuthenticated={isAuthenticated}
    />
  );

  if (!isAuthenticated) {
    return (
      <div className="page">
        {header}

        <main className="login-screen">
          <LoginPanel onLogin={handleLogin} language={language} t={t.login} />
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      {header}

      <main className="main-content">
        <section className="hero-layout">
          <SimulatorForm
            onSubmit={handleSimulation}
            isSubmitting={isSubmitting}
            language={language}
            t={t.simulator}
          />

          <HeroSection language={language} t={t.hero} />
        </section>

        <ApprovedTransactions
          items={approvedTransactions}
          language={language}
          t={t.approved}
        />
      </main>
    </div>
  );
}

export default App;
