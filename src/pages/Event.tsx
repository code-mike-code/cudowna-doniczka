import { FC, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { events } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventPhotoCarousel from "@/components/EventPhotoCarousel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";


const Event: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventPost = events.find((p) => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!eventPost) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Nie znaleziono wydarzenia</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Przepraszamy, wydarzenie, którego szukasz, nie istnieje.
            </p>
            <Button asChild>
              <Link to="/events">Powrót do wydarzeń</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentIndex = events.findIndex((p) => p.id === eventPost.id);
  const prevEvent = currentIndex > 0 ? events[currentIndex - 1] : null;
  const nextEvent = currentIndex < events.length - 1 ? events[currentIndex + 1] : null;

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
              <Button variant="outline" onClick={() => navigate('/events')} className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Wróć do Wydarzeń
              </Button>
              <p className="text-primary font-semibold">{eventPost.category}</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight my-4">
                {eventPost.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{eventPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(eventPost.date)}</span>
                </div>
              </div>
            </header>

            {eventPost.photos && eventPost.photos.length > 0 ? (
              <EventPhotoCarousel photos={eventPost.photos} eventTitle={eventPost.title} />
            ) : (
              <img
                src={eventPost.image}
                alt={eventPost.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl my-8"
                loading="lazy"
              />
            )}

            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventPost.content) }}
            />
          </article>

          <nav className="flex justify-between items-center mt-16 pt-8 border-t">
            {prevEvent ? (
              <Link to={`/events/${prevEvent.id}`} className="flex items-center gap-2 text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                <span>Poprzednie wydarzenie</span>
              </Link>
            ) : <div />}
            {nextEvent ? (
              <Link to={`/events/${nextEvent.id}`} className="flex items-center gap-2 text-primary hover:underline">
                <span>Następne wydarzenie</span>
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

export default Event;
