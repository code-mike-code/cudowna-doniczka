import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// import { ArrowRight } from 'lucide-react';
import heroImage640 from '@/assets/optimized/hero-img-640.webp';
import heroImage1280 from '@/assets/optimized/hero-img-1280.webp';
import heroImage1920 from '@/assets/optimized/hero-img-1920.webp';
import heroImageFallback from '@/assets/hero-img.jpg';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'Od Donic Po Wszystko!';

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden section-natural">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <picture>
          <source
            media="(max-width: 640px)"
            srcSet={heroImage640}
            type="image/webp"
          />
          <source
            media="(max-width: 1280px)"
            srcSet={heroImage1280}
            type="image/webp"
          />
          <source
            media="(min-width: 1281px)"
            srcSet={heroImage1920}
            type="image/webp"
          />
          <img
            src={heroImageFallback}
            alt="Beautiful eco-friendly flowerpots with natural hemp composite"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            width="1920"
            height="1080"
          />
        </picture>
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Headline with Typing Animation */}
          <div className="space-y-4x">
            <h1 className="pt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight break-words hyphens-auto">
              <span className="inline-block typing-animation">
                {displayText}
                <span className="border-r-3 border-primary ml-1 animate-pulse"></span>
              </span>
            </h1>
            <p className="text-fluid-xl text-foreground text-gray-700 py-4 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
              Rewolucyjne doniczki z Mineralnego Kompozytu Konopnego, które pochłaniają CO₂ 
              i tworzą idealny dom dla Twoich roślin. Wspieramy Fundację EWC.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-500">
            {/* <Button 
              className="btn-natural text-lg px-8 py-4"
            >
              Licytuj!
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button> */}
            <Button 
              variant="outline" 
              className="btn-outline text-lg px-8 py-6 hover:bg-background/55"
              asChild
            >
              <a href='#about'>
                Poznaj Naszą Misję
              </a>
            </Button>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 animate-fade-in-up animation-delay-700">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
              <h3 className="font-semibold text-foreground mb-2">Pochłania CO₂</h3>
              <p className="text-sm text-muted-foreground">
                Naturalny filtr dwutlenku węgla
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
              <h3 className="font-semibold text-foreground mb-2">100% Eko</h3>
              <p className="text-sm text-muted-foreground">
                Mineralno-konopny kompozyt
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
              <h3 className="font-semibold text-foreground mb-2">Artystyczne</h3>
              <p className="text-sm text-muted-foreground">
                Ręcznie malowane wzory
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;