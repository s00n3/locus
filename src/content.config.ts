import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Редактируемый контент сайта.
 *
 * Лежит обычными YAML-файлами в репозитории — их правит git-админка
 * (Pages CMS, см. `.pages.yml`), а Astro читает на этапе сборки.
 * Никакой базы и никакого рантайма: сохранение в админке = коммит,
 * коммит = пересборка через GitHub Actions.
 *
 * Сюда попадают только списки, которые заказчик правит регулярно.
 * Постоянные тексты вёрстки (тэглайн героя, подписи) остаются в коде —
 * выносить их в CMS значит платить сложностью за то, что меняется
 * раз в жизни.
 *
 * Коллекции добавляются по мере верстки блоков, а не все заранее:
 * форма полей зависит от того, что реально нарисовано в макете.
 */

/** Блок 4 главной — образовательные треки (ТЗ, раздел 4.1) */
const tracks = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/tracks' }),
  schema: z.object({
    /** Порядок в блоке: меньше — левее */
    order: z.number().default(0),
    title: z.string(),
    /** Аудитории или технологии — чипы на карточке */
    tags: z.array(z.string()).default([]),
    /** Путь от корня сайта, например /uploads/track-ai.jpg */
    image: z.string().optional(),
    imageAlt: z.string().default(''),

    /* --- Попап трека: раскрывается по клику на карточку --- */

    /** Надпись над заголовком в попапе: «ТРЕК 02» */
    label: z.string().default(''),
    modalImage: z.string().optional(),
    modalImageAlt: z.string().default(''),
    /** Абзац в блоке «О треке» */
    about: z.string().default(''),
    /** Пункты «Для кого подойдёт» */
    audience: z.array(z.string()).default([]),
    /** Чипы «Навыки, которые получит студент» */
    skills: z.array(z.string()).default([]),
    /** Подводка под заголовком «Как проходит участие» */
    pipelineLead: z.string().default(''),
    /** Этапы участия */
    stages: z
      .array(
        z.object({
          command: z.string(),
          title: z.string(),
          description: z.string(),
          /** Метка справа: INPUT, FILTER, OUTPUT */
          tag: z.string(),
        }),
      )
      .default([]),
    /** Строка в нижней панели попапа */
    outcome: z.string().default(''),
    /** Необязательная вторая кнопка в нижней панели */
    secondaryAction: z
      .object({
        label: z.string(),
        href: z.string().optional(),
      })
      .optional(),
  }),
});

/** Блок 5 главной — кейсы и проекты (ТЗ, раздел 4.1) */
const cases = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/cases' }),
  schema: z.object({
    /** Порядок в ряду: меньше — левее */
    order: z.number().default(0),
    /** Метка направления поверх фото: AI, SERVICE, DATA */
    tag: z.string(),
    title: z.string(),
    /** Путь вида /src/assets/uploads/foo.webp */
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    problem: z.string(),
    solution: z.string(),
    result: z.string(),
  }),
});

/** Блок 6 главной — кому подойдёт (ТЗ, раздел 4.1) */
const audiences = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/audiences' }),
  schema: z.object({
    /** Порядок в ряду: меньше — левее */
    order: z.number().default(0),
    title: z.string(),
    /** Короткая метка-глагол в углу карточки: learn, search, work, grow */
    label: z.string(),
    /** Пункты списка; дефис в начале строки добавляет вёрстка */
    points: z.array(z.string()).default([]),
  }),
});

/** Блок 7 главной — что получает участник (ТЗ, раздел 4.1) */
const benefits = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/benefits' }),
  schema: z.object({
    /** Порядок в сетке: слева направо, сверху вниз */
    order: z.number().default(0),
    /** Символ в цветном квадрате: </>, { }, @, # и т.п. */
    glyph: z.string(),
    /** Псевдо-вызов рядом с иконкой: project.real, mentor.api */
    key: z.string(),
    /** Номер в шестнадцатеричном виде: 0x01 */
    code: z.string(),
    title: z.string(),
    description: z.string(),
    /** Цветовой акцент карточки */
    accent: z.enum(['cyan', 'terracotta', 'green', 'purple']).default('cyan'),
  }),
});

/** Блок 8 главной — менторы (ТЗ, раздел 4.1) */
const mentors = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/mentors' }),
  schema: z.object({
    /** Порядок в карусели */
    order: z.number().default(0),
    /** Фамилия — набирается жирным */
    surname: z.string(),
    /** Имя — набирается обычным начертанием под фамилией */
    name: z.string(),
    /** Название проекта; подпись «Ментор проекта» добавляет вёрстка */
    project: z.string(),
    description: z.string(),
    /** Рукописная метка в углу карточки: Biotech, Medtech. Можно не заполнять */
    label: z.string().default(''),
    photo: z.string().optional(),
    photoAlt: z.string().default(''),
  }),
});

/** Блок 9 главной — партнёры проекта (ТЗ, раздел 4.1) */
const partners = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/partners' }),
  schema: z.object({
    /** Порядок в ряду: меньше — левее */
    order: z.number().default(0),
    /** Название — уходит в alt логотипа */
    name: z.string(),
    logo: z.string(),
    /** Высота логотипа в пикселях: в макете они разного размера */
    height: z.number().default(168),
    /** Ссылка на сайт партнёра. Можно не заполнять */
    href: z.string().optional(),
  }),
});

/**
 * Блок 13 «Проектов» — направления для мультивыбора (ТЗ, раздел 5.1).
 * Отдельная коллекция, а не список внутри проектов: порядок чипов задаёт
 * дизайн, и направление может существовать раньше своих проектов.
 */
const directions = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/directions' }),
  schema: z.object({
    /** Порядок чипа в ряду: меньше — левее */
    order: z.number().default(0),
    /** Подпись на чипе. Она же уходит в тег карточки, но заглавными */
    title: z.string(),
  }),
});

/** Блок 13 «Проектов» — карточки проектов под чипами (ТЗ, раздел 5.1) */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    /** Порядок в сетке: меньше — раньше */
    order: z.number().default(0),
    title: z.string(),
    /** Одно-два предложения — больше в карточку не помещается */
    summary: z.string(),
    /** Должно совпадать с названием направления из коллекции directions */
    direction: z.string(),
  }),
});

/** Блок 10 главной — FAQ (ТЗ, раздел 4.1) */
const faq = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/faq' }),
  schema: z.object({
    /** Порядок в списке */
    order: z.number().default(0),
    question: z.string(),
    answer: z.string(),
    /** Раскрыт ли пункт при загрузке страницы. В макете раскрыт первый */
    open: z.boolean().default(false),
  }),
});

export const collections = {
  tracks,
  cases,
  audiences,
  benefits,
  mentors,
  partners,
  faq,
  directions,
  projects,
};
