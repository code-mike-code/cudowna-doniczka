import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import product1 from '@/assets/optimized/flowerpots-collection-1.webp';
import product2 from '@/assets/optimized/flowerpots-collection-2.webp';
import product3 from '@/assets/optimized/flowerpots-collection-3.webp';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  features: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'Róża Pasteli',
    price: 89.99,
    originalPrice: 109.99,
    image: product1,
    description: 'Delikatna doniczka w odcieniach dusty rose z naturalnym kompozytem konopnym.',
    features: ['Pochłania CO₂', 'Termoregulacja', 'Ręcznie malowana']
  },
  {
    id: 2,
    name: 'Błękit Natury',
    price: 94.99,
    image: product2,
    description: 'Elegancka doniczka w kolorze sky blue, idealna dla ziół i roślin aromatycznych.',
    features: ['Antybakteryjne', 'Paroprzepuszczalność', 'Ekologiczne']
  },
  {
    id: 3,
    name: 'Mint Garden',
    price: 79.99,
    originalPrice: 99.99,
    image: product3,
    description: 'Świeża mięta w artystycznej doniczce z kompozytu mineralnego.',
    features: ['Wzmacnia rośliny', 'Naturalny filtr', 'Artystyczne wzory']
  }
];

const ProductShowcase = () => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-fluid-3xl font-bold text-foreground mb-4">
            Wybrane Produkty
          </h2>
          <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
            Odkryj naszą kolekcję artystycznych doniczek z Mineralnego Kompozytu Konopnego. 
            Każda doniczka to unikalne dzieło sztuki, które dba o Twoją roślinę i planetę.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="card-product group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="256"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Promocja
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-4 right-4 bg-white/90 hover:bg-white ${
                      likedProducts.has(product.id) ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(product.id);
                    }}
                  >
                    <Heart className={`w-5 h-5 ${likedProducts.has(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {product.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature) => (
                      <span
                        key={feature}
                        className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          {product.price} zł
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice} zł
                          </span>
                        )}
                      </div>
                    </div>
                    <Button className="btn-natural">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Dodaj
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-fade-in-up animation-delay-600">
          <Button variant="outline" className="btn-outline text-lg px-8 py-4">
            Zobacz Wszystkie Produkty
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;