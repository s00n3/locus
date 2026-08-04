// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // TODO: домен ещё не определён (ТЗ, раздел 2: сайт на отдельном домене,
  // не *.sechenov.ru). Как появится — прописать сюда: нужен для canonical,
  // sitemap и og:url.
  // site: 'https://example.ru',

  integrations: [react()],

  build: {
    // CSS одним файлом: стилей немного, лишние запросы ни к чему
    inlineStylesheets: 'auto',
  },
});
