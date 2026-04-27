import { useEffect, useRef, useCallback } from 'react';

interface HeroSunCursorProps {
  size?: 'small' | 'medium' | 'large';
  glowIntensity?: 'low' | 'medium' | 'high';
  warmth?: 'cool' | 'warm' | 'hot';
  heroSelector?: string;
}

const sizeConfig = {
  small:  { glow: 'w-16 h-16',  innerGlow: 'w-8 h-8',   offset: 32, innerOffset: 16 },
  medium: { glow: 'w-24 h-24',  innerGlow: 'w-12 h-12', offset: 48, innerOffset: 24 },
  large:  { glow: 'w-32 h-32',  innerGlow: 'w-16 h-16', offset: 64, innerOffset: 32 },
};

const warmthConfig = {
  cool: {
    outerGlow: 'from-white via-yellow-100 via-yellow-200 to-orange-200',
    innerGlow: 'from-white via-yellow-50 to-yellow-100',
    blur: 'blur-sm',
  },
  warm: {
    outerGlow: 'from-white via-yellow-200 via-orange-300 to-orange-400',
    innerGlow: 'from-white via-yellow-100 to-orange-200',
    blur: 'blur-md',
  },
  hot: {
    outerGlow: 'from-white via-yellow-300 via-orange-400 to-red-400',
    innerGlow: 'from-white via-yellow-200 to-orange-300',
    blur: 'blur-lg',
  },
};

const glowConfig = {
  low:    'opacity-40',
  medium: 'opacity-60',
  high:   'opacity-80',
};

const HeroSunCursor = ({
  size = 'medium',
  glowIntensity = 'medium',
  warmth = 'warm',
  heroSelector = '#hero',
}: HeroSunCursorProps) => {
  const outerRef  = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    x: 0,
    y: 0,
    isClicking: false,
    isVisible: false,
    rafId: 0,
    heroRect: null as DOMRect | null,
  });

  const updateDOM = useCallback(() => {
    const { x, y, isClicking, isVisible } = stateRef.current;
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.style.display = isVisible ? '' : 'none';
    if (!isVisible) return;

    const cfg = sizeConfig[size];
    const outer  = outerRef.current;
    const inner  = innerRef.current;
    const center = centerRef.current;
    const dot    = dotRef.current;

    if (outer) {
      outer.style.left = `${x - cfg.offset}px`;
      outer.style.top  = `${y - cfg.offset}px`;
      outer.style.transform = isClicking ? 'scale(1.25)' : '';
    }
    if (inner) {
      inner.style.left = `${x - cfg.innerOffset}px`;
      inner.style.top  = `${y - cfg.innerOffset}px`;
      inner.style.transform = isClicking ? 'scale(1.10)' : '';
    }
    if (center) {
      center.style.left = `${x - 6}px`;
      center.style.top  = `${y - 6}px`;
      center.style.transform = isClicking ? 'scale(1.50)' : '';
    }
    if (dot) {
      dot.style.left = `${x - 2}px`;
      dot.style.top  = `${y - 2}px`;
    }
  }, [size]);

  useEffect(() => {
    const heroElement = document.querySelector(heroSelector);
    if (!heroElement) return;

    heroElement.classList.add('hero-cursor-area');

    const cacheRect = () => {
      stateRef.current.heroRect = heroElement.getBoundingClientRect();
    };
    cacheRect();

    const inHero = (x: number, y: number) => {
      const r = stateRef.current.heroRect;
      if (!r) return false;
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };

    const scheduleRaf = () => {
      if (stateRef.current.rafId) return;
      stateRef.current.rafId = requestAnimationFrame(() => {
        stateRef.current.rafId = 0;
        updateDOM();
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
      stateRef.current.isVisible = inHero(e.clientX, e.clientY);
      scheduleRaf();
    };

    const handleMouseLeave = () => {
      stateRef.current.isVisible = false;
      scheduleRaf();
    };

    const handleMouseDown = () => {
      if (stateRef.current.isVisible) {
        stateRef.current.isClicking = true;
        scheduleRaf();
      }
    };

    const handleMouseUp = () => {
      stateRef.current.isClicking = false;
      scheduleRaf();
    };

    const handleScroll = () => {
      cacheRect();
      stateRef.current.isVisible = inHero(stateRef.current.x, stateRef.current.y);
      scheduleRaf();
    };

    const handleResize = () => {
      cacheRect();
    };

    document.addEventListener('mousemove',  handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown',  handleMouseDown);
    document.addEventListener('mouseup',    handleMouseUp);
    window.addEventListener('scroll',  handleScroll,  { passive: true });
    window.addEventListener('resize',  handleResize,  { passive: true });

    return () => {
      heroElement.classList.remove('hero-cursor-area');
      cancelAnimationFrame(stateRef.current.rafId);
      document.removeEventListener('mousemove',  handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown',  handleMouseDown);
      document.removeEventListener('mouseup',    handleMouseUp);
      window.removeEventListener('scroll',  handleScroll);
      window.removeEventListener('resize',  handleResize);
    };
  }, [heroSelector, updateDOM]);

  const cfg = sizeConfig[size];
  const w   = warmthConfig[warmth];
  const g   = glowConfig[glowIntensity];

  return (
    <div ref={wrapRef} aria-hidden="true" style={{ display: 'none' }}>
      <div
        ref={outerRef}
        className={`hero-sun-cursor ${cfg.glow} bg-radial-sun ${w.outerGlow} ${g} rounded-full ${w.blur} animate-gentle-pulse transition-transform duration-300`}
        style={{ position: 'fixed', pointerEvents: 'none' }}
      />
      <div
        ref={innerRef}
        className={`hero-sun-cursor ${cfg.innerGlow} bg-radial-sun ${w.innerGlow} ${g} rounded-full blur-sm animate-shimmer transition-transform duration-200`}
        style={{ position: 'fixed', pointerEvents: 'none' }}
      />
      <div
        ref={centerRef}
        className="hero-sun-cursor w-3 h-3 bg-radial-sun from-white to-yellow-100 rounded-full animate-shimmer transition-transform duration-150"
        style={{ position: 'fixed', pointerEvents: 'none' }}
      />
      <div
        ref={dotRef}
        className="hero-sun-cursor w-1 h-1 bg-white rounded-full animate-soft-glow"
        style={{ position: 'fixed', pointerEvents: 'none' }}
      />
    </div>
  );
};

export default HeroSunCursor;
