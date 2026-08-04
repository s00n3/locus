const BASE = import.meta.env.BASE_URL;

/**
 * Путь с учётом base — сайт на GitHub Pages лежит в подпапке /locus.
 * Все внутренние ссылки и пути к файлам из public строить только через это:
 * `withBase('/projects')` → `/locus/projects`.
 *
 * Когда переедем на свой домен и base исчезнет, вызовы менять не придётся.
 */
export function withBase(path: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rest = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rest}`;
}
