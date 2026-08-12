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

/* ---------------------------------------------------------------------------
   Подбор профессий по тегам (ТЗ №4).

   Раньше профессия показывалась по совпадению с направлениями первого шага.
   Теперь у неё в CMS список тегов и порог: тег — это название чипа или
   карточки любого из трёх шагов, поэтому «отмеченное» собирается со всех
   трёх сразу. Правило одно и лежит здесь, чтобы блок результата и паутина
   компетенций не разошлись в трактовке.
   --------------------------------------------------------------------------- */

/** Отмеченное на всех трёх шагах одним списком — пул для сверки с тегами */
export function readChosenTags(): string[] {
  return [...selectedValues('direction'), ...selectedValues('area'), ...selectedValues('level')];
}

export interface ProfessionRule {
  /** Должны быть отмечены все */
  required: string[];
  /** Из них должно совпасть не меньше matchMin */
  optional: string[];
  matchMin: number;
}

/**
 * Правило лежит в разметке (`data-required-tags`, `data-optional-tags`,
 * `data-match-min`), а не в скрипте: так его выдаёт сборка из CMS, и блоки
 * остаются несвязанными — как и остальной конструктор.
 */
export function readRule(el: HTMLElement): ProfessionRule {
  const list = (value: string | undefined) => (value ?? '').split('|').filter(Boolean);

  return {
    required: list(el.dataset.requiredTags),
    optional: list(el.dataset.optionalTags),
    matchMin: Number(el.dataset.matchMin ?? '0'),
  };
}

export function matchesRule(rule: ProfessionRule, chosen: string[]): boolean {
  // Пустое правило не показываем никогда: иначе ненастроенная профессия
  // висела бы у всех подряд. О таких предупреждает сборка.
  if (rule.required.length === 0 && rule.optional.length === 0) return false;

  const обязательныеОтмечены = rule.required.every((tag) => chosen.includes(tag));
  const совпалоНеобязательных = rule.optional.filter((tag) => chosen.includes(tag)).length;

  return обязательныеОтмечены && совпалоНеобязательных >= rule.matchMin;
}

/**
 * Пересчёт подбора после любого выбора в конструкторе. Слушаем документ,
 * а не сами кнопки: шаги живут в других компонентах, и связывать их
 * напрямую незачем.
 */
export function onConstructorChange(handler: () => void): void {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('button[data-direction], button[data-area], button[data-level]')) {
      handler();
    }
  });
}
