# Шрифты

IBM Plex Sans + IBM Plex Mono, лицензия **SIL Open Font License 1.1** (`OFL.txt`) —
разрешает self-host в репозитории (ТЗ, раздел 2 / handoff, раздел 6).

Файлы `.woff2` скопированы из npm-пакетов `@fontsource/ibm-plex-sans` и
`@fontsource/ibm-plex-mono` (это те же официальные IBM Plex, разбитые на сабсеты).
Пакеты оставлены в `devDependencies` — только чтобы можно было обновить или
досабсетить файлы; в рантайме сайт их не использует, шрифты отдаются отсюда.

Лежат в `src/`, а не в `public/`, намеренно: так Vite сам проставляет хеш в имени
(вечный кеш) и префикс `base`. На GitHub Pages сайт живёт в подпапке `/locus`, и
абсолютные пути вида `/fonts/…` там бы отвалились.

## Что лежит

| Файл | Гарнитура | Начертание | Сабсет |
|---|---|---|---|
| `ibm-plex-sans-cyrillic-400-normal.woff2` | Sans | Regular 400 | cyrillic |
| `ibm-plex-sans-latin-400-normal.woff2` | Sans | Regular 400 | latin |
| `ibm-plex-sans-cyrillic-500-normal.woff2` | Sans | Medium 500 | cyrillic |
| `ibm-plex-sans-latin-500-normal.woff2` | Sans | Medium 500 | latin |
| `ibm-plex-mono-cyrillic-400-normal.woff2` | Mono | Regular 400 | cyrillic |
| `ibm-plex-mono-latin-400-normal.woff2` | Mono | Regular 400 | latin |

Больше начертаний типо-шкала `Type/*` не требует: Sans Regular/Medium и Mono Regular
покрывают все 16 стилей.

## Как обновить

```bash
npm i -D @fontsource/ibm-plex-sans@latest @fontsource/ibm-plex-mono@latest
```

затем скопировать нужные файлы из `node_modules/@fontsource/*/files/` сюда.
`@font-face` и `unicode-range` описаны в `src/styles/fonts.css` (пути относительные,
`../fonts/…`), preload — в `src/layouts/BaseLayout.astro` через импорт `?url`.
