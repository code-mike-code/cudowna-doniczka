import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Recycle, Thermometer, Droplets, Shield, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation'; // Dostosuj ścieżkę do hooka
import { useState, useCallback, useEffect } from 'react';

// Import optimized product images
import productImg1 from '@/assets/optimized/product-img/1.webp';
import productImg2 from '@/assets/optimized/product-img/2.webp';
import productImg3 from '@/assets/optimized/product-img/3.webp';
import productImg4 from '@/assets/optimized/product-img/4.webp';
import productImg5 from '@/assets/optimized/product-img/5.webp';
import productImg6 from '@/assets/optimized/product-img/6.webp';

const productImages = [
  { src: productImg1, alt: 'Cudowna Doniczka MKK - widok produktu 1' },
  { src: productImg2, alt: 'Cudowna Doniczka MKK - widok produktu 2' },
  { src: productImg3, alt: 'Cudowna Doniczka MKK - widok produktu 3' },
  { src: productImg4, alt: 'Cudowna Doniczka MKK - widok produktu 4' },
  { src: productImg5, alt: 'Cudowna Doniczka MKK - widok produktu 5' },
  { src: productImg6, alt: 'Cudowna Doniczka MKK - widok produktu 6' },
];

const benefits = [
  {
    icon: Recycle,
    title: 'Pochłania CO₂',
    description: 'MKK działa jak naturalny filtr, wychwytując dwutlenek węgla z powietrza i zamieniając go w wapień.'
  },
  {
    icon: Thermometer,
    title: 'Termoregulacja',
    description: 'Zapewnia stałą temperaturę korzeniom dzięki naturalnym właściwościom kompozytu mineralnego.'
  },
  {
    icon: Droplets,
    title: 'Paroprzepuszczalność',
    description: 'Doskonała regulacja wilgotności tworzy idealne środowisko dla systemu korzeniowego.'
  },
  {
    icon: Shield,
    title: 'Naturalna Ochrona',
    description: 'Składniki mineralne i konopne naturalnie wspierają zdrowie i wzrost roślin.'
  },
  {
    icon: Leaf,
    title: '100% Ekologiczne',
    description: 'Wykonane z naturalnego paździerza konopnego i selekcjonowanych minerałów z rzadkich skał.'
  },
  {
    icon: Heart,
    title: 'Wspiera Fundację',
    description: 'Każdy zakup wspiera działalność charytatywną Fundacji EWC i promuje ekologię.'
  }
];

const AboutProduct: React.FC = () => {
  // Hook for Visual Element
  const { isVisible: isVisualVisible, ref: visualRef } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Hook for Benefits Grid
  const { isVisible: isBenefitsVisible, ref: benefitsRef } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px' // Wcześniejszy trigger dla gridu, by karty animowały stopniowo
  });

  // Hook for Gallery
  const { isVisible: isGalleryVisible, ref: galleryRef } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext]);

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <section id="product" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-fluid-3xl font-bold text-foreground mb-4">
            O Produkcie
          </h2>
          <h3 className="text-fluid-xl font-semibold text-primary mb-6">
            Cudowna Doniczka MKK – Naturalny Dom dla Roślin
          </h3>
          <p className="text-fluid-lg text-muted-foreground max-w-4xl mx-auto">
            Nasza Doniczka to rewolucja w uprawie roślin, będąca odpowiedzią na paradoks plastikowych 
            doniczek, które zatruwają planetę, w których zamykamy rośliny produkujące tlen.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Technology Description */}
          <div className="space-y-6 animate-fade-in-up animation-delay-200">
            <div>
              <h4 className="text-2xl font-semibold text-foreground mb-4">
                Mineralny Kompozyt Konopny (MKK)
              </h4>
              <p className="text-muted-foreground mb-4">
                MKK to wyjątkowy, wysoce zrównoważony produkt łączący technologię i sztukę. 
                To mieszanka specjalnie przygotowanego paździerza konopnego i specjalnego spoiwa 
                na bazie wapna i selekcjonowanych minerałów.
              </p>
              <p className="text-muted-foreground">
                W miarę upływu czasu MKK nabiera coraz większej trwałości, a zawarte związki 
                wychwytują CO₂ z powietrza i zamieniają je w wapień, który wzmacnia konstrukcję.
              </p>
            </div>

            <div className="bg-accent rounded-2xl p-6">
              <h5 className="font-semibold text-foreground mb-3">Naturalny Dom dla Rośliny</h5>
              <p className="text-sm text-muted-foreground">
                Nasza doniczka to nie tylko pojemnik – to naturalny dom dla rośliny, 
                zbudowany z tych samych naturalnych składników, którymi się odżywia.
              </p>
            </div>
          </div>

          {/* Visual Element with scroll animation */}
          <div
            ref={visualRef}
            className={`bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 rounded-3xl p-8 flex items-center justify-center transition-all duration-700 ease-out ${
              isVisualVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="w-12 h-12 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">
                Ekologia w Akcji
              </h4>
              <p className="text-muted-foreground text-sm max-w-xs">
                Każda doniczka przyczynia się do redukcji CO₂ w atmosferze
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Grid z animacją na scroll */}
        <div
          ref={benefitsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
            isBenefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card
                key={benefit.title}
                className={`card-natural p-4 transition-all duration-700 ease-out ${
                  isBenefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <CardContent className="py-2 px-2 text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Product Gallery */}
        <div
          ref={galleryRef}
          className={`mt-16 transition-all duration-700 ease-out ${
            isGalleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-fluid-xl font-semibold text-foreground text-center mb-8">
            Galeria Cudownej Doniczki
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={`relative aspect-square overflow-hidden rounded-xl bg-accent/50 cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                style={{
                  transition: `opacity 700ms ease-out ${(index + 1) * 100}ms, transform 700ms ease-out ${(index + 1) * 100}ms`,
                  opacity: isGalleryVisible ? 1 : 0,
                  transform: isGalleryVisible ? 'translateY(0)' : 'translateY(1rem)'
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Zamknij"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Poprzednie zdjęcie"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Image container */}
            <div
              className="max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={productImages[currentImageIndex].src}
                alt={productImages[currentImageIndex].alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <p className="text-white text-center mt-4 text-sm">
                {currentImageIndex + 1} / {productImages.length}
              </p>
            </div>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Następne zdjęcie"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 animate-fade-in-up animation-delay-700">
          <div className="bg-gradient-to-r from-primary/5 via-accent/10 to-secondary/5 rounded-2xl p-8">
            <h4 className="text-2xl font-semibold text-foreground mb-4">
              Dołącz do Eko-Rewolucji
            </h4>
            <p className="text-muted-foreground mb-6">
              Wybierając Cudowną Doniczkę, inwestujesz w przyszłość planety i wspierasz działalność charytatywną.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProduct;
