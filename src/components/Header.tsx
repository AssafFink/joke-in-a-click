// TODO: replace with '../assets/kitten.png' once spec/assets/kitten.png is supplied.
import kitten from '../assets/kitten-placeholder.svg';
import { strings } from '../strings';
import { Burst, Heart } from './Decorations';

export function Header() {
  return (
    <header className="header">
      <h1 className="header__title">
        <Burst className="burst" />
        <span>{strings.title}</span>
        <Burst className="burst burst--mirror" />
      </h1>
      <div className="header__art">
        <Heart className="float-heart float-heart--1" />
        <Heart className="float-heart float-heart--2" />
        <Heart className="float-heart float-heart--3" />
        <Heart className="float-heart float-heart--4" />
        <img className="header__kitten" src={kitten} alt="" />
      </div>
      <svg className="header__wave" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 22 Q100 0 200 16 T400 14 V40 H0 Z" fill="currentColor" />
      </svg>
    </header>
  );
}
