import { DEFAULT_ROTATION_INTERVAL } from './autoRotatingTabs';

interface RailProgressFillOptions {
  bars: () => Element[];
  keyframes?: Keyframe[];
  pseudoElement?: string;
  interval?: number;
}

/**
 * Animates the rail/bar beside the active tab as a read-timer synced to
 * setupAutoRotatingTabs: wire `start` to onIntervalStart, `pause` to
 * onIntervalPause, and call `cancel` on manual tab activation so the bar
 * falls back to its CSS-driven state.
 */
export function createRailProgressFill({
  bars,
  keyframes = [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
  pseudoElement,
  interval = DEFAULT_ROTATION_INTERVAL,
}: RailProgressFillOptions) {
  let animations: Animation[] = [];

  const cancel = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  };

  const start = () => {
    cancel();
    animations = bars().map((bar) => bar.animate(keyframes, {
      duration: interval,
      easing: 'linear',
      fill: 'forwards',
      ...(pseudoElement ? { pseudoElement } : {}),
    }));
  };

  const pause = () => {
    animations.forEach((animation) => animation.pause());
  };

  return { start, pause, cancel };
}
