import { useEffect, useMemo, useState } from 'react';
import arrowLeft from '../assets/ArrowLeft.svg';
import arrowRight from '../assets/ArrowRight.svg';

function ApprovedTransactions({ items, t, language }) {
  const visibleCount = 3;
  const [startIndex, setStartIndex] = useState(0);

  const isRTL = language === 'he';

  useEffect(() => {
    const maxStartIndex = Math.max(items.length - visibleCount, 0);

    if (startIndex > maxStartIndex) {
      setStartIndex(maxStartIndex);
    }
  }, [items, startIndex]);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, startIndex + visibleCount);
  }, [items, startIndex]);

  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + visibleCount < items.length;

  function handlePrev() {
    if (!canGoLeft) return;
    setStartIndex((prev) => Math.max(prev - 1, 0));
  }

  function handleNext() {
    if (!canGoRight) return;
    setStartIndex((prev) => prev + 1);
  }

  return (
    <section className="approved">
      <h2 className="approved-title">{t.title}</h2>

      <div className="list">
        {/* RTL-aware arrow */}
        <button
          type="button"
          className="nav-button"
          onClick={handlePrev}
          disabled={!canGoLeft}
          aria-label={t.previous}
        >
          <img src={isRTL ? arrowRight : arrowLeft} alt="" />
        </button>

        <div className="cards">
          {visibleItems.length > 0 ? (
            visibleItems.map((item) => (
              <div key={item.id} className="card">
                <div className="card-time">
                  {t.time}: {item.localTime}
                </div>

                <div className="card-region">
                  {t.timeZone}: {item.region}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">{t.empty}</div>
          )}
        </div>

        {/* RTL-aware arrow */}
        <button
          type="button"
          className="nav-button"
          onClick={handleNext}
          disabled={!canGoRight}
          aria-label={t.next}
        >
          <img src={isRTL ? arrowLeft : arrowRight} alt="" />
        </button>
      </div>
    </section>
  );
}

export default ApprovedTransactions;
