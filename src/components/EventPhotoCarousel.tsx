import { FC, useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventPhotoCarouselProps {
  photos: string[];
  eventTitle: string;
}

const EventPhotoCarousel: FC<EventPhotoCarouselProps> = ({ photos, eventTitle }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Display main photo + up to 6 thumbnails (7 total)
  const displayPhotos = photos.slice(0, 7);
  const mainPhoto = displayPhotos[selectedPhotoIndex];
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  const goToNext = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % displayPhotos.length);
  };
  
  const goToPrev = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };
  
  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };
  
  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && displayPhotos.length > 1) {
      autoPlayIntervalRef.current = setInterval(() => {
        goToNext();
      }, 4000); // Change photo every 4 seconds
      
      return () => {
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
        }
      };
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    }
  }, [isAutoPlaying, displayPhotos.length, selectedPhotoIndex]);
  
  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };
  
  return (
    <div className="my-8 space-y-4">
      {/* Main Photo */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-muted group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={mainPhoto}
          alt={`${eventTitle} - zdjęcie ${selectedPhotoIndex + 1}`}
          className="w-full h-auto max-h-[500px] object-contain transition-opacity duration-300"
          loading="lazy"
        />
        
        {/* Navigation arrows - visible on desktop */}
        {displayPhotos.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
              onClick={goToPrev}
              aria-label="Poprzednie zdjęcie"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
              onClick={goToNext}
              aria-label="Następne zdjęcie"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Auto-play toggle */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={toggleAutoPlay}
              aria-label={isAutoPlaying ? 'Zatrzymaj automatyczne przewijanie' : 'Włącz automatyczne przewijanie'}
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {displayPhotos.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {displayPhotos.map((photo, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedPhotoIndex(index);
                setIsAutoPlaying(false); // Stop auto-play when user manually selects
              }}
              className={`
                min-w-[44px] min-h-[44px] w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${index === selectedPhotoIndex ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-accent'}
              `}
              aria-label={`Pokaż zdjęcie ${index + 1}`}
            >
              <img
                src={photo}
                alt={`${eventTitle} - miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Photo counter */}
      {displayPhotos.length > 1 && (
        <p className="text-center text-sm text-muted-foreground">
          Zdjęcie {selectedPhotoIndex + 1} z {displayPhotos.length}
          {photos.length > 7 && ` (wyświetlono ${displayPhotos.length} z ${photos.length})`}
        </p>
      )}
    </div>
  );
};

export default EventPhotoCarousel;
