import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { events } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

const Events: FC = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Wydarzenia</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dołącz do naszych warsztatów, aukcji i webinarów. Bądź częścią społeczności Cudownej Doniczki i zmieniaj z nami świat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((post) => (
              <Card key={post.id} className="group flex flex-col">
                <CardContent className="p-0">
                  <Link to={`/events/${post.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                </CardContent>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-primary font-semibold">{post.category}</p>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 mt-2">
                    <Link to={`/events/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mt-2 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link to="/">Powrót do strony głównej</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Events;
