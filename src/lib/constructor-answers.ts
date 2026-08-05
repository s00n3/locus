/**
 * Ответы конструктора «Проектов» для формы индивидуального плана.
 *
 * Заказчик предупредил, что саму механику конструктора будут пересматривать,
 * поэтому связь собрана в одном файле и держится на атрибутах разметки:
 * форма ничего не знает про блоки, блоки — про форму. Общего состояния нет,
 * значения читаются в момент открытия формы. Менять механику — здесь.
 *
 * Шаги отдают выбор так:
 *   шаг 1, чипы направлений  — [data-direction] + aria-pressed
 *   шаг 2, области           — [data-area]      + aria-checked
 *   шаг 3, уровни опыта      — [data-level]     + aria-checked
 *
 * На страницах без конструктора селекторы просто ничего не находят,
 * и форма открывается с пустыми полями — так и задумано.
 */

export interface ConstructorAnswers {
  /** Может быть несколько: первый шаг — мультивыбор */
  directions: string[];
  area: string;
  level: string;
}

/** Атрибут data-* у выбранных элементов. Невыбранные и не-кнопки отсеиваются */
function selectedValues(attribute: string): string[] {
  return [...document.querySelectorAll<HTMLElement>(`[data-${attribute}]`)]
    .filter(
      (el) =>
        el.getAttribute('aria-pressed') === 'true' || el.getAttribute('aria-checked') === 'true',
    )
    .map((el) => el.getAttribute(`data-${attribute}`) ?? '')
    .filter(Boolean);
}

export function readConstructorAnswers(): ConstructorAnswers {
  return {
    directions: selectedValues('direction'),
    area: selectedValues('area')[0] ?? '',
    level: selectedValues('level')[0] ?? '',
  };
}
