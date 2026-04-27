import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gavel, Clock, TrendingUp } from 'lucide-react';
import product1 from '@/assets/optimized/flowerpots-collection-1.webp';
import product2 from '@/assets/optimized/flowerpots-collection-2.webp';
import product3 from '@/assets/optimized/flowerpots-collection-3.webp';
import familyPaintingBackground from '@/assets/optimized/generated-image.webp';

interface AuctionItem {
  id: number;
  name: string;
  currentBid: number;
  startingPrice: number;
  image: string;
  endTime: Date;
  bidCount: number;
  description: string;
}

const auctionItems: AuctionItem[] = [
  {
    id: 1,
    name: 'Limitowana Edycja Artystyczna',
    currentBid: 156.50,
    startingPrice: 50.00,
    image: product1,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
    bidCount: 12,
    description: 'Unikalna doniczka ręcznie malowana przez lokalnego artystę.'
  },
  {
    id: 2,
    name: 'Kolekcja Charity Edition',
    currentBid: 89.00,
    startingPrice: 30.00,
    image: product2,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    bidCount: 8,
    description: '100% zysku trafia do Fundacji EWC na cele charytatywne.'
  },
  {
    id: 3,
    name: 'Vintage Herb Collection',
    currentBid: 234.75,
    startingPrice: 75.00,
    image: product3,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
    bidCount: 24,
    description: 'Set trzech vintage doniczek z nasionami ziół organicznych.'
  }
];

const CountdownTimer = ({ endTime }: { endTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState(endTime.getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(endTime.getTime() - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (timeLeft <= 0) {
    return <span className="text-destructive font-semibold">Aukcja zakończona</span>;
  }

  return (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <Clock className="w-4 h-4 text-primary" />
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    </div>
  );
};

const AuctionSection = () => {
  return (
    <section 
      id="auctions" 
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: `url(${familyPaintingBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-soft mb-6">
            <Gavel className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Aukcje Charytatywne
            </span>
          </div>
          <h2 className="text-fluid-3xl font-bold text-foreground mb-4">
            Najnowsze Aukcje
          </h2>
          <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
            Każda aukcja wspiera Fundację EWC. Licytuj unikalne, artystyczne doniczki 
            i wspieraj dobre cele jednocześnie.
          </p>
        </div>

        {/* Auction Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {auctionItems.map((item, index) => (
            <Card
              key={item.id}
              className="card-product group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <CardContent className="p-0">
                {/* Auction Image */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="192"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{item.bidCount} licytacji</span>
                  </div>
                </div>

                {/* Auction Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>

                  {/* Current Bid */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Obecna oferta:</span>
                      <span className="text-xl font-bold text-foreground">
                        {item.currentBid.toFixed(2)} zł
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Cena startowa: {item.startingPrice.toFixed(2)} zł
                      </span>
                      <div className="text-xs text-primary font-medium">
                        +{((item.currentBid / item.startingPrice - 1) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="bg-accent rounded-lg p-3">
                    <CountdownTimer endTime={item.endTime} />
                  </div>

                  {/* Bid Button */}
                  <Button className="w-full btn-natural">
                    <Gavel className="w-4 h-4 mr-2" />
                    Licytuj Teraz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Auctions Button */}
        <div className="text-center mt-12 animate-fade-in-up animation-delay-600">
          <Button variant="outline" className="btn-outline text-lg px-8 py-4">
            Zobacz Wszystkie Aukcje
          </Button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default AuctionSection;