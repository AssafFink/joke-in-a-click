import { strings, TOPIC_MAX_LENGTH } from '../strings';
import { Paw } from './Decorations';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TopicField({ value, onChange }: Props) {
  return (
    <div className="topic">
      <label className="section-title" htmlFor="topic">
        {strings.topicLabel}
      </label>
      <div className="topic__box">
        <input
          id="topic"
          className="topic__input"
          type="text"
          value={value}
          maxLength={TOPIC_MAX_LENGTH}
          placeholder={strings.topicPlaceholder}
          aria-describedby="topic-counter"
          autoComplete="off"
          // Safety net in addition to maxLength: always cap at 100 JS characters.
          onChange={(e) => onChange(e.target.value.slice(0, TOPIC_MAX_LENGTH))}
        />
        <Paw className="topic__paw" />
      </div>
      <div id="topic-counter" className="topic__counter" dir="ltr">
        {value.length}/{TOPIC_MAX_LENGTH}
      </div>
    </div>
  );
}
