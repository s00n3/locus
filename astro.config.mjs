// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Пока живём на GitHub Pages как project site → сайт лежит в подпапке /locus.
  // TODO: когда появится свой домен (ТЗ, раздел 2: сайт вне зоны sechenov.ru) —
  // поменять site на него и убрать base. Пути к ассетам это переживут: шрифты
  // импортируются из src, ссылки строятся от import.meta.env.BASE_URL.
  site: 'https://s00n3.github.io',
  base: '/locus',

  integrations: [react()],

  build: {
    // CSS одним файлом: стилей немного, лишние запросы ни к чему
    inlineStylesheets: 'auto',
  },
});
