const DEFAULT_ROTATION_INTERVAL = 5000;

interface AutoRotatingTabsOptions<TabElement extends Element = Element> {
  root: Element;
  tabs: TabElement[];
  activate: (tab: TabElement) => void;
  interval?: number;
}

export function setupAutoRotatingTabs<TabElement extends Element>({
  root,
  tabs,
  activate,
  interval = DEFAULT_ROTATION_INTERVAL,
}: AutoRotatingTabsOptions<TabElement>) {
  if (tabs.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let timer = 0;
  let isPaused = false;

  const selectedTabIndex = () => {
    const selectedIndex = tabs.findIndex((tab) => (
      tab.getAttribute('aria-selected') === 'true'
      || tab.getAttribute('aria-expanded') === 'true'
      || tab.classList.contains('is-active')
    ));

    return selectedIndex >= 0 ? selectedIndex : 0;
  };

  const clearTimer = () => {
    if (!timer) return;
    window.clearTimeout(timer);
    timer = 0;
  };

  const schedule = () => {
    clearTimer();
    if (isPaused || !root.isConnected) return;

    timer = window.setTimeout(() => {
      if (document.visibilityState === 'hidden') {
        schedule();
        return;
      }

      const nextIndex = (selectedTabIndex() + 1) % tabs.length;
      activate(tabs[nextIndex]);
      schedule();
    }, interval);
  };

  const pause = () => {
    isPaused = true;
    clearTimer();
  };

  const resume = () => {
    isPaused = false;
    schedule();
  };

  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', resume);
  root.addEventListener('focusin', pause);
  root.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!root.contains(document.activeElement)) resume();
    }, 0);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      clearTimer();
    } else if (!isPaused) {
      schedule();
    }
  });

  schedule();
}
