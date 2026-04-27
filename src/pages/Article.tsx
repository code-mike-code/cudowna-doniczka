import { FC, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { blogPosts } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";


const Article: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Nie znaleziono artykułu</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Przepraszamy, artykuł, którego szukasz, nie istnieje.
            </p>
            <Button asChild>
              <Link to="/blog">Powrót do bloga</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentIndex = blogPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

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
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <article>
            <header className="mb-8">
              <Button variant="outline" onClick={() => navigate('/blog')} className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Wróć do Bloga
              </Button>
              <p className="text-primary font-semibold">{post.category}</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight my-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <span>{post.readTime} min czytania</span>
              </div>
            </header>

            <img
              src={post.image}
              alt={post.title}
              className={`w-full h-auto max-h-[500px] object-cover rounded-2xl my-8 ${
                post.imagePosition === 'top' ? 'object-top' : 
                post.imagePosition === 'bottom' ? 'object-bottom' : 
                'object-center'
              }`}
              loading="lazy"
            />

            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
          </article>

          <nav className="flex justify-between items-center mt-16 pt-8 border-t">
            {prevPost ? (
              <Link to={`/blog/${prevPost.id}`} className="flex items-center gap-2 text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                <span>Poprzedni artykuł</span>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link to={`/blog/${nextPost.id}`} className="flex items-center gap-2 text-primary hover:underline">
                <span>Następny artykuł</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : <div />}
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Article;
