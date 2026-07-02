import React from 'react';
import './ExerciseDetails.scss';

export const ExerciseDetails: React.FC = () => {
  return (
    <div className="exercise-details-sheet">
      <div className="sheet-header">
        <h1 className="exercise-title">Базові присідання</h1>
        <span className="exercise-step">Вправа 2 / 5</span>
      </div>

      <div className="video-container">
        <iframe
          src="https://www.youtube.com/embed/WrIu5qzWY-U"
          title="Відео вправи"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="instructions-section">
        <h2>Як виконувати:</h2>

        <p>
          Станьте рівно, стопи на ширині таза. Спина пряма, погляд
          спрямований уперед. Руки можна тримати перед собою для балансу
          або схрестити на грудях.
        </p>

        <p>
          На вдиху повільно відведіть таз назад і зігніть коліна,
          ніби сідаєте на уявний стілець. Опускайтеся до комфортного
          рівня, поки стегна не стануть приблизно паралельними підлозі.
        </p>

        <p>
          На видиху плавно підніміться у вихідне положення,
          відштовхуючись п'ятами від підлоги, і напружте сідниці
          у верхній точці.
        </p>
      </div>

      <div className="warning-box">
        <h2>Зверніть увагу:</h2>

        <ul>
          <li>
            Не вигинайте спину в попереку — тримайте нейтральне
            положення корпусу.
          </li>

          <li>
            Слідкуйте, щоб коліна не завалювалися всередину.
          </li>

          <li>
            Основна вага має припадати на п'яти та середину стопи.
          </li>
        </ul>
      </div>
    </div>
  );
};