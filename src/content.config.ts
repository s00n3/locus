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
    /** Куда ведёт карточка: виджет трека появится на блоке 23 */
    href: z.string().optional(),
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

export const collections = { tracks, cases, audiences, benefits };
