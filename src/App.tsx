import { useRef, useState } from 'react';
import { Header } from './components/Header';
import { TopicField } from './components/TopicField';
import { JokeCard } from './components/JokeCard';
import { Burst, Sparkles } from './components/Decorations';
import { strings } from './strings';
import { getDevSample } from './devSamples';
import { NetworkError, requestJoke } from './api';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'offline';

// In local development only, ?sample=he|en fills the card with long test text.
function initialJoke(): string | null {
  if (import.meta.env.DEV) {
    return getDevSample(new URLSearchParams(window.location.search).get('sample'));
  }
  return null;
}

export function App() {
  const [topic, setTopic] = useState('');
  const [joke, setJoke] = useState<string | null>(initialJoke);
  const [status, setStatus] = useState<Status>('idle');
  const loading = status === 'loading';
  // Locks synchronously, before React re-renders the button as disabled.
  const inFlight = useRef(false);

  async function handleClick() {
    if (inFlight.current) return;
    // Offline: no request is sent and the card keeps its current content.
    if (!navigator.onLine) {
      setStatus('offline');
      return;
    }
    inFlight.current = true;
    setStatus('loading');
    try {
      setJoke(await requestJoke(topic));
      setStatus('success');
    } catch (err) {
      // The previous joke (or the empty state) stays in the card.
      setStatus(err instanceof NetworkError && !navigator.onLine ? 'offline' : 'error');
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="content">
        <TopicField value={topic} onChange={setTopic} />

        <div className="action">
          <Burst className="burst" />
          <button type="button" className="primary-button" disabled={loading} onClick={handleClick}>
            <Sparkles className="primary-button__icon" />
            {strings.button}
          </button>
          <Burst className="burst burst--mirror" />
        </div>
        <p className="message" role="status" aria-live="polite">
          {status === 'error' ? strings.error : status === 'offline' ? strings.offline : ''}
        </p>

        <JokeCard joke={joke} loading={loading} />
      </main>
    </div>
  );
}
