import { lockScroll, unlockScroll } from './scroll-lock';

interface Options {
  /** Селектор кнопок, открывающих окно. Ищутся по всему документу */
  triggers: string;
  /** Селектор панели внутри окна: клик мимо неё закрывает */
  panel: string;
  /** Вызывается перед открытием — сбросить состояние формы */
  onOpen?: () => void;
}

/**
 * Открытие и закрытие модального окна на нативном `<dialog>`.
 *
 * Сам dialog запирает фокус, закрывается по Esc и прячет страницу от
 * скринридеров — здесь только то, чего он не делает: связывание с кнопками,
 * блокировка прокрутки, возврат фокуса и закрытие кликом мимо панели.
 *
 * Кнопки ищутся по всему документу: они стоят и в секциях, и внутри других
 * окон (например «Подать заявку» живёт в попапе трека).
 */
export function setupModal(dialog: HTMLDialogElement, { triggers, panel, onOpen }: Options): void {
  let opener: HTMLElement | null = null;

  // Возвращаем фокус, только если кнопка ещё видима: окна открываются друг
  // из друга, и та могла уехать вместе с закрытым окном
  const restore = () => {
    if (opener?.isConnected && opener.offsetParent !== null) opener.focus();
    opener = null;
  };

  // Прибираемся и по событию close, и в явных обработчиках: событие покрывает
  // Esc, но если оно не придёт, страница останется без прокрутки
  const cleanup = () => {
    unlockScroll(dialog);
    restore();
  };

  const close = () => {
    if (dialog.open) dialog.close();
    cleanup();
  };

  document.querySelectorAll<HTMLElement>(triggers).forEach((trigger) => {
    trigger.addEventListener('click', () => {
      // Кнопка может стоять внутри другого окна — закрываем его, иначе два
      // окна лягут друг на друга в верхнем слое
      const parent = trigger.closest('dialog') as HTMLDialogElement | null;
      if (parent && parent !== dialog) parent.close();

      opener = trigger;
      onOpen?.();
      dialog.showModal();
      lockScroll(dialog);
    });
  });

  dialog.addEventListener('close', cleanup);

  // Все кнопки закрытия, а не первая: у окна их может быть несколько —
  // крестик в углу и «Закрыть» в состоянии-подтверждении (ТЗ 5.1)
  dialog.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', close);
  });

  // Клик мимо панели закрывает окно: у самого dialog нет отступов, поэтому
  // попадание за её пределы надёжно определяется рамкой
  dialog.addEventListener('click', (event) => {
    const box = dialog.querySelector(panel);
    if (!box || !(event.target instanceof Node)) return;
    if (box.contains(event.target)) return;
    close();
  });
}
