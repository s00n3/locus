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
 * Направления проектов (пояснение к ТЗ, п. 4).
 *
 * Часть справочника соответствий: воронка «интерес/навыки → направление →
 * проекты → трек → роль». Направление принадлежит одному треку, проект —
 * одному направлению и несёт навыки-теги.
 *
 * В документации заказчика девять направлений, в макете нарисовано семь
 * чипов — ряд с переносом это выдерживает (ТЗ, раздел 5.1).
 */
const directions = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/directions' }),
  schema: z.object({
    /** Порядок чипа в ряду: меньше — левее */
    order: z.number().default(0),
    /** Подпись на чипе. Она же уходит в тег карточки, но заглавными */
    title: z.string(),
    /**
     * Идентификатор трека из коллекции tracks — имя файла без .yaml.
     * Привязка ЧЕРНОВАЯ: в документации она явно не задана, ждёт
     * подтверждения заказчика (пояснение к ТЗ, п. 6.2).
     */
    track: z.string().default(''),
    /**
     * Навыки-теги направления. Пока пусто: заполняет заказчик.
     * На них потом встанет подбор по навыкам — «кубики» из брифа, —
     * без переверстки блока (пояснение к ТЗ, п. 5).
     */
    skills: z.array(z.string()).default([]),
  }),
});

/** Проекты — карточки под чипами (ТЗ, раздел 5.1; пояснение, п. 4) */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    /** Порядок в сетке: меньше — раньше */
    order: z.number().default(0),
    title: z.string(),
    /** Одно-два предложения — больше в карточку не помещается */
    summary: z.string(),
    /**
     * Направления проекта — каждое должно слово в слово совпадать
     * с названием из коллекции directions. Массив, а не строка: один
     * проект бывает сразу на стыке нескольких направлений (ТЗ №2, п. 4).
     *
     * Одиночная строка тоже принимается и превращается в массив из одного
     * элемента: так старые файлы (и админка, если её ещё не обновили)
     * не роняют сборку. Пустой список означает, что проект не попадёт
     * ни в один подбор — об этом предупреждает RecommendedResult.
     */
    directions: z
      .union([z.string(), z.array(z.string())])
      .default([])
      .transform((value) => (typeof value === 'string' ? [value] : value)),
    /**
     * Тип проекта из списка в документации: интеллектуальные системы,
     * агенты ИИ, анализ данных, MedTech, BioTech, VR/AR/CV, кейсы и MVP.
     * Пока не заполнено — ждёт заказчика.
     */
    type: z.string().default(''),
    /** Навыки-теги проекта. Пока пусто, см. комментарий у directions */
    skills: z.array(z.string()).default([]),
    /** Кадр на карточке в блоке результата подбора */
    image: z.string().optional(),
    imageAlt: z.string().default(''),
  }),
});

/**
 * Блок 14 «Проектов» — второй шаг конструктора, «Какие задачи хочешь решать».
 * Набор здесь свой, он НЕ совпадает с чипами первого шага: там семь узких
 * направлений, тут пять широких областей развития.
 */
const areas = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/areas' }),
  schema: z.object({
    /** Порядок в сетке: слева направо, сверху вниз */
    order: z.number().default(0),
    title: z.string(),
    description: z.string(),
    /** Чипы навыков в подвале карточки */
    skills: z.array(z.string()).default([]),
    /** Путь вида /src/assets/uploads/foo.png */
    image: z.string().optional(),
    imageAlt: z.string().default(''),
  }),
});

/**
 * Блок 15 «Проектов» — третий шаг конструктора, «Уровень опыта».
 * Иллюстрации — электронные орбитали s/p/d/f: чем выше уровень, тем
 * сложнее форма. Отсюда и буква в кружке.
 */
const levels = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/levels' }),
  schema: z.object({
    /** Порядок в ряду: меньше — левее */
    order: z.number().default(0),
    title: z.string(),
    /** Уточнение под названием. У «Эксперта» в макете его нет */
    note: z.string().default(''),
    /** Буква орбитали в кружке: s, p, d, f */
    letter: z.string().default(''),
    image: z.string().optional(),
    imageAlt: z.string().default(''),
  }),
});

/**
 * Профессии — результат подбора на «Проектах» и будущая паутина компетенций.
 *
 * Не путать с ролями из пояснения к ТЗ (координатор, технический писатель,
 * менеджер команды): те описывают роли внутри проектной команды, а здесь —
 * профессии как итог воронки. В макете «Профессии» и чипы паутины показывают
 * одни и те же названия, поэтому коллекция одна на два блока.
 */
const professions = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/professions' }),
  schema: z.object({
    /** Порядок в ряду: меньше — левее */
    order: z.number().default(0),
    title: z.string(),
    /**
     * Названия направлений, к которым ведёт профессия. Связка ЧЕРНОВАЯ:
     * ни в ТЗ, ни в пояснении её нет, выставлена по смыслу названий.
     */
    directions: z.array(z.string()).default([]),
    /**
     * Оси паутины компетенций и их значения, 0–100. Паутина рисуется из
     * этих цифр, а не картинкой, поэтому набор осей должен совпадать
     * у всех профессий — иначе перестроение между ними теряет смысл.
     * Расхождение не роняет сборку, но пишет предупреждение в лог.
     */
    competencies: z
      .array(
        z.object({
          name: z.string(),
          value: z.number().min(0).max(100),
        }),
      )
      .default([]),
    image: z.string().optional(),
    imageAlt: z.string().default(''),
  }),
});

/**
 * Блок 18 «Сообщества» — эксперты проекта (ТЗ, раздел 4.3).
 *
 * Ряды в макете чередуются: у первого и третьего эксперта карточка слева,
 * панель проектов справа, у второго наоборот. Порядок задаёт вёрстка,
 * в контенте этого нет — заказчику незачем думать про сторону.
 */
const experts = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/experts' }),
  schema: z.object({
    /** Порядок сверху вниз */
    order: z.number().default(0),
    name: z.string(),
    /** Должность и специализация — строка под именем */
    role: z.string(),
    /** Рассказ от первого лица или справка. Абзац целиком */
    bio: z.string(),
    photo: z.string().optional(),
    photoAlt: z.string().default(''),
    /**
     * Панель «Основные проекты в сфере». В макете два вида: у одного
     * эксперта название проекта плюс абзац, у остальных нумерованный
     * список. Поддерживаем оба, заполнять нужно только своё.
     */
    projectsLead: z.string().default(''),
    projectsText: z.string().default(''),
    projectsItems: z.array(z.string()).default([]),
  }),
});

/**
 * Блок 19 «Сообщества» — «Наши выпускники» (ТЗ, раздел 4.3, «Вы можете
 * быть здесь»). В макете пять одинаковых демо-карточек и фото-заглушка;
 * реальные истории подставит заказчик.
 */
const graduates = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/graduates' }),
  schema: z.object({
    /** Порядок слева направо */
    order: z.number().default(0),
    /** Фамилия — набирается жирным над именем */
    surname: z.string(),
    name: z.string(),
    /** Строка под именем: «Выпуск 2025» */
    year: z.string().default(''),
    /** Что делал в школе */
    project: z.string(),
    /** Где сейчас */
    current: z.string(),
    /** Отзыв в кавычках, курсивом */
    quote: z.string().default(''),
    photo: z.string().optional(),
    photoAlt: z.string().default(''),
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
  areas,
  levels,
  professions,
  experts,
  graduates,
};
