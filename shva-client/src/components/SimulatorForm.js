import { useEffect, useMemo, useRef, useState } from 'react';
import timeIcon from '../assets/time-icon.svg';
import clearIcon from '../assets/clear-icon.svg';

const REGION_OPTIONS = ['France', 'Israel', 'Cyprus', 'Italy', 'USA', 'Japan'];

function SimulatorForm({ onSubmit, isSubmitting, t }) {
  const [region, setRegion] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hour, setHour] = useState('20');
  const [minute, setMinute] = useState('00');
  const [error, setError] = useState('');

  const regionRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredRegions = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();

    if (!normalized) {
      return REGION_OPTIONS;
    }

    return REGION_OPTIONS.filter((item) =>
      item.toLowerCase().includes(normalized),
    );
  }, [searchValue]);

  function resetError() {
    setError('');
  }

  function handleRegionInputChange(event) {
    const value = event.target.value;

    setSearchValue(value);
    setRegion(value);
    setIsDropdownOpen(true);
    resetError();
  }

  function handleRegionSelect(selectedRegion) {
    setRegion(selectedRegion);
    setSearchValue(selectedRegion);
    setIsDropdownOpen(false);
    resetError();
  }

  function handleClearRegion() {
    setRegion('');
    setSearchValue('');
    setIsDropdownOpen(false);
    resetError();
  }

  function handleHourChange(event) {
    const onlyDigits = event.target.value.replace(/\D/g, '').slice(0, 2);
    setHour(onlyDigits);
    resetError();

    if (onlyDigits.length === 2) {
      minuteRef.current?.focus();
    }
  }

  function handleMinuteChange(event) {
    const onlyDigits = event.target.value.replace(/\D/g, '').slice(0, 2);
    setMinute(onlyDigits);
    resetError();
  }

  function handleCancel() {
    setRegion('');
    setSearchValue('');
    setHour('20');
    setMinute('00');
    setError('');
    setIsDropdownOpen(false);
    hourRef.current?.focus();
  }

  function validateForm() {
    const normalizedRegion = region.trim();

    if (!normalizedRegion) {
      return t.errors.regionRequired;
    }

    const matchedRegion = REGION_OPTIONS.find(
      (item) => item.toLowerCase() === normalizedRegion.toLowerCase(),
    );

    if (!matchedRegion) {
      return t.errors.regionInvalid;
    }

    if (!/^\d{1,2}$/.test(hour) || !/^\d{1,2}$/.test(minute)) {
      return t.errors.timeInvalid;
    }

    const h = Number(hour);
    const m = Number(minute);

    if (h < 0 || h > 23) {
      return t.errors.hourInvalid;
    }

    if (m < 0 || m > 59) {
      return t.errors.minuteInvalid;
    }

    return null;
  }

  async function handleSubmit() {
    resetError();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const matchedRegion = REGION_OPTIONS.find(
      (item) => item.toLowerCase() === region.trim().toLowerCase(),
    );

    const formattedTime = `${String(Number(hour)).padStart(2, '0')}:${String(Number(minute)).padStart(2, '0')}`;
    const result = await onSubmit(matchedRegion, formattedTime);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setRegion(matchedRegion);
    setSearchValue(matchedRegion);
    setIsDropdownOpen(false);
  }

  function handleRegionKeyDown(event) {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      return;
    }

    if (event.key === 'Enter' && filteredRegions.length === 1) {
      handleRegionSelect(filteredRegions[0]);
    }
  }

  function handleTimeKeyDown(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }

    if (event.key === 'Escape') {
      handleCancel();
    }
  }

  return (
    <section className="simulator-form">
      <div className="region-field" ref={regionRef}>
        <label className="region-label">{t.regionLabel}</label>

        <div className="region-input-box">
          <input
            type="text"
            className="region-input"
            value={searchValue}
            placeholder={t.regionPlaceholder}
            autoComplete="off"
            maxLength={30}
            onChange={handleRegionInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleRegionKeyDown}
          />

          <button
            type="button"
            className="region-clear-button"
            onClick={handleClearRegion}
            aria-label={t.clearRegion}
          >
            <img src={clearIcon} alt="" />
          </button>
        </div>

        {isDropdownOpen && (
          <div className="region-dropdown">
            {filteredRegions.length > 0 ? (
              filteredRegions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="region-option"
                  onClick={() => handleRegionSelect(item)}
                >
                  {item}
                </button>
              ))
            ) : (
              <div className="region-empty">{t.noResults}</div>
            )}
          </div>
        )}
      </div>

      <div className="time-panel">
        <div className="time-title">{t.timeTitle}</div>

        <div className="time-picker">
          <div className="time-section">
            <input
              ref={hourRef}
              type="text"
              inputMode="numeric"
              maxLength={2}
              className="time-box time-box-hour"
              value={hour}
              placeholder="00"
              onChange={handleHourChange}
              onKeyDown={handleTimeKeyDown}
            />
            <span className="time-caption">{t.hourLabel}</span>
          </div>

          <div className="time-separator">:</div>

          <div className="time-section">
            <input
              ref={minuteRef}
              type="text"
              inputMode="numeric"
              maxLength={2}
              className="time-box time-box-minute"
              value={minute}
              placeholder="00"
              onChange={handleMinuteChange}
              onKeyDown={handleTimeKeyDown}
            />
            <span className="time-caption">{t.minuteLabel}</span>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="time-footer">
          <img src={timeIcon} alt="" className="time-footer-icon" />

          <div className="time-footer-actions">
            <button
              type="button"
              className="text-action-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {t.cancel}
            </button>

            <button
              type="button"
              className="text-action-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '...' : t.ok}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SimulatorForm;
