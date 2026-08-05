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

export const collections = { tracks };
