import { FC, useState, useRef } from 'react';
import { faqData, faqCategories } from '@/lib/faqData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronDown, 
  Search, 
  MessageSquare, 
  Send,
  CheckCircle2
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const CommunityFAQ: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('wszystkie');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Filtrowanie pytań
  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === 'wszystkie' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Obsługa wysyłki formularza
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration z zmiennych środowiskowych
      const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Sprawdzenie konfiguracji
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.error('EmailJS configuration missing');
        toast.warning('Konfiguracja EmailJS jest niekompletna', {
          description: 'Skontaktuj się z administratorem.'
        });
        setIsSubmitting(false);
        return;
      }

      // Pobierz dane z formularza
      const formData = new FormData(formRef.current!);
      const userName = formData.get('user_name') as string || 'Anonim';
      const userEmail = formData.get('user_email') as string;
      const category = formData.get('category') as string;
      const message = formData.get('message') as string;

      // Wyślij email używając emailjs.send (jak w ContactForm)
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: userName,
          from_email: userEmail,
          message: `[PYTANIE - ${category.toUpperCase()}]\n\n${message}`,
          to_name: 'Cudowna Doniczka',
        },
        EMAILJS_PUBLIC_KEY
      );

      toast.success('Pytanie zostało wysłane!', {
        description: 'Odpowiemy na nie wkrótce i może pojawi się tutaj.'
      });

      formRef.current?.reset();
    } catch (error) {
      console.error('Błąd wysyłki:', error);
      toast.error('Wystąpił błąd', {
        description: 'Spróbuj ponownie lub napisz do nas bezpośrednio.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Nagłówek sekcji */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pytania od Społeczności
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Najczęściej zadawane pytania przez naszych klientów. 
            Nie znalazłeś odpowiedzi? Zadaj własne pytanie!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Kolumna FAQ */}
          <div className="md:col-span-2 space-y-6">
            {/* Filtry i wyszukiwarka */}
            <div className="space-y-4">
              {/* Kategorie */}
              <div className="flex flex-wrap gap-2">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-white hover:bg-accent border border-border'
                    }`}
                  >
                    <span className="mr-1.5">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Wyszukiwarka */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Szukaj pytania..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Lista pytań */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-border">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nie znaleziono pytań. Może Ty zadasz pierwsze?
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <button
                      onClick={() => setOpenItemId(openItemId === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {faq.question}
                        </h3>
                        {faq.author && (
                          <p className="text-xs text-muted-foreground">
                            Pytanie od: {faq.author}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-primary transition-transform flex-shrink-0 ml-4 ${
                          openItemId === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {openItemId === faq.id && (
                      <div className="px-6 pb-4 pt-2 border-t border-border/50">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                        {faq.helpful !== undefined && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{faq.helpful} osób uznało to za pomocne</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Kolumna formularza */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Zadaj pytanie
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Masz pytanie? Wyślij je do nas – odpowiemy najszybciej jak to możliwe!
              </p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="user_name" className="text-sm font-medium mb-1.5 block">
                    Twoje imię (opcjonalnie)
                  </label>
                  <Input
                    type="text"
                    id="user_name"
                    name="user_name"
                    placeholder="Jan Kowalski"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="user_email" className="text-sm font-medium mb-1.5 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    id="user_email"
                    name="user_email"
                    placeholder="twoj@email.pl"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="text-sm font-medium mb-1.5 block">
                    Kategoria
                  </label>
                  <Select name="category" defaultValue="produkty">
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produkty">Produkty</SelectItem>
                      <SelectItem value="zamówienia">Zamówienia</SelectItem>
                      <SelectItem value="ekologia">Ekologia</SelectItem>
                      <SelectItem value="inne">Inne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-1.5 block">
                    Twoje pytanie
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Napisz swoje pytanie..."
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Wysyłanie...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Wyślij pytanie
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Odpowiemy na email i możliwe, że Twoje pytanie pojawi się tutaj, pomagając innym!
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityFAQ;
