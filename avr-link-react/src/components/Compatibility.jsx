import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompatibility } from '../hooks/useCompatibility';

// How many search suggestions to show.
const MAX_RESULTS = 6;
const BRANDS = ['Denon', 'Marantz'];

const normalize = (v) => v.toLowerCase().replace(/[^a-z0-9]/g, '');

// Higher score = better match. -1 = no match.
function score(item, query) {
  const model = normalize(item.model);
  const brand = normalize(item.brand);
  const q = normalize(query);

  if (!q) return 0;
  if (model === q) return 1000;
  if (model.indexOf(q) === 0) return 800 - model.length;
  if (model.indexOf(q) !== -1) return 600 - model.length;
  if (brand.indexOf(q) === 0) return 500 - brand.length;
  if (brand.indexOf(q) !== -1) return 400 - brand.length;

  // Partial credit when the query contains several model fragments.
  const fragments = q.match(/[a-z]+|[0-9]+/g) || [];
  const matched = fragments.filter((f) => model.indexOf(f) !== -1 || brand.indexOf(f) !== -1).length;
  return matched ? matched * 100 - model.length : -1;
}

function ResultCard({ item, expanded, onToggle }) {
  return (
    <div
      className="compatibility-result"
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="compatibility-result-header">
        <div className="compatibility-result-name">
          <span className={`compatibility-result-brand ${item.brand.toLowerCase()}`}>{item.brand}</span>
          <span className="compatibility-result-model"> {item.model}</span>
        </div>
        <span className="compatibility-result-chevron" aria-hidden="true">⌄</span>
      </div>
      <div className="compatibility-result-details">
        <p className="compatibility-result-detail">
          <span className="compatibility-result-detail-label">Tested on:</span> {item.version || 'Not specified'}
        </p>
        <p className="compatibility-result-detail">
          <span className="compatibility-result-detail-label">Notes:</span> {item.notes || 'No additional notes.'}
        </p>
      </div>
    </div>
  );
}

export default function Compatibility() {
  const { models, error } = useCompatibility();
  const [query, setQuery] = useState('');
  const [touched, setTouched] = useState(false); // has the user typed yet?
  const [openIndex, setOpenIndex] = useState(null); // only one card open at a time

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    return models
      .map((item) => ({ item, score: score(item, query) }))
      .filter((m) => m.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);
  }, [models, query]);

  const onChange = (e) => {
    setQuery(e.target.value);
    setTouched(true);
    setOpenIndex(null);
  };

  function renderResults() {
    if (error) {
      return <div className="compatibility-empty"><span>Compatibility data could not be loaded. Please try again later.</span></div>;
    }
    if (!touched) {
      return (
        <div className="compatibility-empty">
          AVR Link was designed to work with most Denon and Marantz AV receivers. However, due to the limitations of
          being a solo developer, compatibility information is based solely on external testing. If you would like to
          contribute to the growing catalog, please <Link to="/support">contact us</Link>.
        </div>
      );
    }
    if (!query.trim()) {
      return <div className="compatibility-empty"><span>Nothing to look for!</span></div>;
    }
    if (!matches.length) {
      return (
        <div className="compatibility-empty">
          <span>No tested models matched “{query}”. Try a different model number.</span>
        </div>
      );
    }
    return (
      <>
        {matches.length > 1 && <div className="compatibility-results-heading">Compatible receivers:</div>}
        <div className="compatibility-result-list">
          {matches.map(({ item }, i) => (
            <ResultCard
              key={`${item.brand}-${item.model}`}
              item={item}
              expanded={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <section className="compatibility-section" id="compatibility">
      <div className="compatibility-intro">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h2 className="section-title">Is your AVR supported?</h2>
        </div>
        <p>
          Search the receivers AVR Link has been personally tested with. Start typing your model and we’ll surface the closest matches.
        </p>
      </div>

      <div className="compatibility-search">
        <label className="compatibility-search-label" htmlFor="compatibilitySearch">Find your receiver</label>
        <div className="compatibility-search-box">
          <span className="compatibility-search-icon" aria-hidden="true">⌕</span>
          <input
            id="compatibilitySearch"
            className="compatibility-search-input"
            type="search"
            placeholder="e.g. AVR-X3800H"
            autoComplete="off"
            spellCheck="false"
            aria-describedby="compatibilitySearchHint"
            aria-controls="compatibilityResults"
            value={query}
            onChange={onChange}
          />
        </div>
        <p id="compatibilitySearchHint" className="compatibility-search-hint">Search by model number or receiver name.</p>
      </div>

      <div id="compatibilityResults" className="compatibility-results" aria-live="polite">
        {renderResults()}
      </div>

      <details className="compatibility-browse">
        <summary>Browse model catalog</summary>
        <div className="compatibility-grid">
          {BRANDS.map((brand) => (
            <div className="compatibility-brand" key={brand}>
              <span className="compatibility-brand-label">{brand}</span>
              <ul className="compatibility-models">
                {models.filter((m) => m.brand === brand).map((m) => (
                  <li key={m.model}>{m.model}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="compatibility-note">More tested models will be added as they are verified.</p>
      </details>
    </section>
  );
}
