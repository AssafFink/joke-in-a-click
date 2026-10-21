import { strings } from '../strings';
import { Heart, Smiley } from './Decorations';

type Props = {
  joke: string | null;
};

export function JokeCard({ joke }: Props) {
  return (
    <section className="joke" aria-labelledby="joke-heading">
      <h2 id="joke-heading" className="section-title">
        {strings.jokeHeading}
      </h2>
      <div className="joke__card" aria-live="polite">
        {joke === null ? (
          <div className="joke__empty">
            <Heart className="card-heart card-heart--1" />
            <Heart className="card-heart card-heart--2" />
            <Smiley className="joke__smiley" />
            <p>{strings.cardEmpty}</p>
          </div>
        ) : (
          // Plain text only; dir="auto" lets Hebrew/English jokes pick their own direction.
          <p className="joke__text" dir="auto">
            {joke}
          </p>
        )}
      </div>
    </section>
  );
}
