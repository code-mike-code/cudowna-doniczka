import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/lib/data';

const BlogPreview = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Ekologia':
        return 'bg-primary/20 text-primary';
      case 'Sztuka':
        return 'bg-secondary-accent text-secondary-foreground';
      case 'Charytatywność':
        return 'bg-sky/50 text-sky-foreground';
      default:
        return 'bg-accent text-accent-foreground';
    }
  };

  return (
    <section id="blog" className="py-20 section-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          
          <h2 className="text-fluid-3xl font-bold text-foreground mb-4">
            Inspiracje i Wiedza
          </h2>
          <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
            Czytaj o ekologii, sztuce i działaniach charytatywnych. Dowiedz się więcej 
            o naszej misji i inspiruj się do działania.
          </p>
          <div className="inline-flex items-center space-x-2 bg-accent px-6 py-3 rounded-full shadow-soft mt-9">
            <BookOpen className="w-5 h-5 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">
              Najnowsze z Bloga
            </span>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="block group">
              <Card
                className="card-product h-full cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <CardContent className="p-0">
                  {/* Post Image */}
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="192"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Post Meta */}
                    <div className="space-y-3 pt-2 border-t mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <span>{post.readTime} min czytania</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        {/* <div className="bg-white rounded-3xl p-8 text-center animate-fade-in-up animation-delay-600">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Bądź na Bieżąco
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Zapisz się do naszego newslettera i otrzymuj najnowsze artykuły, 
            informacje o aukcjach i projektach charytatywnych.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Twój adres e-mail"
              className="flex-1 px-4 py-3 rounded-full border border-border bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <Button className="btn-natural h-full px-8 rounded-full px-8 py-3 text-xl">
              Zapisz się
            </Button>
          </div>
        </div> */}

        {/* View All Blog Button */}
        <div className="text-center mt-12 animate-fade-in-up animation-delay-700">
          <Button asChild variant="outline" className="btn-outline text-lg px-8 py-4">
            <Link to="/blog">Zobacz Wszystkie Artykuły</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;