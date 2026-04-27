import { useEffect, useRef, useState, useCallback } from 'react';

interface HeroSunCursorProps {
  size?: 'small' | 'medium' | 'large';
  glowIntensity?: 'low' | 'medium' | 'high';
  warmth?: 'cool' | 'warm' | 'hot';
  heroSelector?: string;
}

const HeroSunCursor: React.FC<HeroSunCursorProps> = ({
  size = 'medium',
  glowIntensity = 'medium',
  warmth = 'warm',
  heroSelector = '#hero'
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Use refs for values needed inside event handlers to avoid re-render loops
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isInHeroRef = useRef(false);

  const checkIfInHeroSection = useCallback((heroElement: Element, x: number, y: number): boolean => {
    const heroRect = heroElement.getBoundingClientRect();
    return (
      x >= heroRect.left &&
      x <= heroRect.right &&
      y >= heroRect.top &&
      y <= heroRect.bottom
    );
  }, []);

  useEffect(() => {
    const heroElement = document.querySelector(heroSelector);
    if (!heroElement) return;

    heroElement.classList.add('hero-cursor-area');

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      const inHero = checkIfInHeroSection(heroElement, e.clientX, e.clientY);
      isInHeroRef.current = inHero;
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(inHero);
    };

    const handleMouseLeave = () => {
      isInHeroRef.current = false;
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      if (isInHeroRef.current) {
        setIsClicking(true);
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleScroll = () => {
      const { x, y } = mousePositionRef.current;
      const inHero = checkIfInHeroSection(heroElement, x, y);
      isInHeroRef.current = inHero;
      setIsVisible(inHero);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll);

    return () => {
      heroElement.classList.remove('hero-cursor-area');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroSelector, checkIfInHeroSection]);

  // Konfiguracja rozmiarów
  const sizeConfig = {
    small: { glow: 'w-16 h-16', innerGlow: 'w-8 h-8' },
    medium: { glow: 'w-24 h-24', innerGlow: 'w-12 h-12' },
    large: { glow: 'w-32 h-32', innerGlow: 'w-16 h-16' }
  };

  // Konfiguracja ciepłości kolorów
  const warmthConfig = {
    cool: {
      outerGlow: 'from-white via-yellow-100 via-yellow-200 to-orange-200',
      innerGlow: 'from-white via-yellow-50 to-yellow-100',
      blur: 'blur-sm'
    },
    warm: {
      outerGlow: 'from-white via-yellow-200 via-orange-300 to-orange-400',
      innerGlow: 'from-white via-yellow-100 to-orange-200',
      blur: 'blur-md'
    },
    hot: {
      outerGlow: 'from-white via-yellow-300 via-orange-400 to-red-400',
      innerGlow: 'from-white via-yellow-200 to-orange-300',
      blur: 'blur-lg'
    }
  };

  // Konfiguracja intensywności poświaty
  const glowConfig = {
    low: 'opacity-40',
    medium: 'opacity-60',
    high: 'opacity-80'
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Zewnętrzna poświata - największa i najbardziej rozmyta */}
      <div
        className={`hero-sun-cursor ${sizeConfig[size].glow} bg-radial-sun ${warmthConfig[warmth].outerGlow} ${glowConfig[glowIntensity]} rounded-full ${warmthConfig[warmth].blur} animate-gentle-pulse transition-transform duration-300 ${isClicking ? 'scale-125' : ''}`}
        style={{
          left: mousePosition.x - (size === 'small' ? 32 : size === 'medium' ? 48 : 64),
          top: mousePosition.y - (size === 'small' ? 32 : size === 'medium' ? 48 : 64),
        }}
      />

      {/* Wewnętrzna poświata - bardziej intensywna */}
      <div
        className={`hero-sun-cursor ${sizeConfig[size].innerGlow} bg-radial-sun ${warmthConfig[warmth].innerGlow} ${glowConfig[glowIntensity]} rounded-full blur-sm animate-shimmer transition-transform duration-200 ${isClicking ? 'scale-110' : ''}`}
        style={{
          left: mousePosition.x - (size === 'small' ? 16 : size === 'medium' ? 24 : 32),
          top: mousePosition.y - (size === 'small' ? 16 : size === 'medium' ? 24 : 32),
        }}
      />

      {/* Centralny punkt - najjaśniejszy */}
      <div
        className={`hero-sun-cursor w-3 h-3 bg-radial-sun from-white to-yellow-100 rounded-full animate-shimmer transition-transform duration-150 ${isClicking ? 'scale-150' : ''}`}
        style={{
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
        }}
      />

      {/* Dodatkowy efekt oślepienia - bardzo subtelny */}
      <div
        className="hero-sun-cursor w-1 h-1 bg-white rounded-full animate-soft-glow"
        style={{
          left: mousePosition.x - 2,
          top: mousePosition.y - 2,
        }}
      />
    </>
  );
};

export default HeroSunCursor;
