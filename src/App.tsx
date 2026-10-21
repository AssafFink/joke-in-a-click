import { useState } from 'react';
import { Header } from './components/Header';
import { TopicField } from './components/TopicField';
import { JokeCard } from './components/JokeCard';
import { Burst, Sparkles } from './components/Decorations';
import { strings } from './strings';
import { getDevSample } from './devSamples';

// In local development only, ?sample=he|en fills the card with long test text.
function initialJoke(): string | null {
  if (import.meta.env.DEV) {
    return getDevSample(new URLSearchParams(window.location.search).get('sample'));
  }
  return null;
}

export function App() {
  const [topic, setTopic] = useState('');
  const [joke] = useState<string | null>(initialJoke);

  return (
    <div className="app">
      <Header />
      <main className="content">
        <TopicField value={topic} onChange={setTopic} />

        <div className="action">
          <Burst className="burst" />
          {/* Disabled until joke generation is connected (Milestone 2). */}
          <button type="button" className="primary-button" disabled>
            <Sparkles className="primary-button__icon" />
            {strings.button}
          </button>
          <Burst className="burst burst--mirror" />
        </div>
        <p className="message" role="status" aria-live="polite"></p>

        <JokeCard joke={joke} />
      </main>
    </div>
  );
}
