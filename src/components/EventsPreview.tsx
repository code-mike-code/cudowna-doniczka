import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { events } from '@/lib/data';

const EventsPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 3000);
  }, [stopTimer]);

  const goToPrevious = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stopTimer();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    startTimer();
  }, [stopTimer, startTimer]);

  const goToNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stopTimer();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    startTimer();
  }, [stopTimer, startTimer]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const currentPost = events[currentIndex];

  return (
    <section id="events" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-fluid-3xl font-bold text-foreground mb-4">
            Namaluj Swój Świat Na Nowo!
          </h2>
          <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
            Poprzez innowacyjną technologię MKK, która pochłania dwutlenek węgla (CO₂), oraz poprzez aktywizację artystyczną i charytatywną, zapraszamy Cię do harmonijnego współistnienia.
          </p>
           <div className="flex flex-wrap justify-center gap-4 mt-16 text-sm">
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full font-medium">
                🌱 Ekologia
              </span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full font-medium">
                🎨 Sztuka
              </span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full font-medium">
                💚 Dobroczynność
              </span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full font-medium">
                🤝 Społeczność
              </span>
            </div>
        </div>

        {/* Events Carousel - Single Card Display */}
        <div 
          className="mb-12 relative"
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
        >
          <Card className="card-product w-full group cursor-pointer animate-fade-in-up">
            <Link to={`/events/${currentPost.id}`} className="block">
              <CardContent className="p-0">
                {/* Post Image */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    src={currentPost.image}
                    alt={currentPost.title}
                    className="w-full h-[340px] object-cover"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="340"
                  />
                </div>

                {/* Post Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {currentPost.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {currentPost.excerpt}
                  </p>

                  {/* Post Meta */}
                  <div className="flex items-center justify-between pt-2 border-t mt-4">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(currentPost.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <span>Zobacz więcej</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors z-10"
            aria-label="Poprzednie wydarzenie"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors z-10"
            aria-label="Następne wydarzenie"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Past Events Button */}
        <div className="text-center mt-12 animate-fade-in-up animation-delay-700">
          <Button asChild variant="outline" className="btn-outline text-lg px-8 py-4">
            <Link to="/events">Zobacz Wszystkie Wydarzenia</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
