import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutProduct from '@/components/AboutProduct';
import AboutUs from '@/components/AboutUs';
import CarbonImpactSection from '@/components/CarbonImpactSection';
import CommunityFAQ from '@/components/CommunityFAQ';
import EventsPreview from '@/components/EventsPreview';
import BlogPreview from '@/components/BlogPreview';
import { ContactForm } from '@/components/ContactForm';
import Footer from '@/components/Footer';
import HeroSunCursor from '@/components/HeroSunCursor';

const Index = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Use requestAnimationFrame to ensure we scroll after layout is calculated
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        });
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "Organization"],
          "@id": "https://cudownadoniczka.pl/#organization",
          "name": "Cudowna Doniczka",
          "description": "Ekologiczne doniczki z Mineralnego Kompozytu Konopnego (MKK) pochłaniają CO₂. Projekt Fundacji EWC łączący ekologię, sztukę i lokalną społeczność – Warszawa.",
          "url": "https://cudownadoniczka.pl",
          "logo": {
            "@type": "ImageObject",
            "url": "https://cudownadoniczka.pl/logo.webp",
            "width": 300,
            "height": 80
          },
          "image": "https://cudownadoniczka.pl/og-image.webp",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Warszawa",
            "addressRegion": "mazowieckie",
            "addressCountry": "PL"
          },
          "areaServed": [
            { "@type": "State", "name": "mazowieckie" },
            { "@type": "Country", "name": "Polska" }
          ],
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "00:00",
            "closes": "23:59"
          },
          "foundingDate": "2024",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Oferta Cudowna Doniczka",
            "itemListElement": [
              { "@type": "Offer", "name": "Doniczki z MKK", "description": "Ekologiczne doniczki z Mineralnego Kompozytu Konopnego pochłaniające CO₂." },
              { "@type": "Offer", "name": "Warsztaty malowania doniczek", "description": "Kreatywne warsztaty artystyczne – malowanie doniczek techniką akwarelową." },
              { "@type": "Offer", "name": "Aukcje doniczek", "description": "Aukcje ręcznie malowanych doniczek wspierające lokalne inicjatywy." },
              { "@type": "Offer", "name": "Sprzedaż hurtowa", "description": "Atrakcyjne ceny hurtowe dla sklepów ogrodniczych i dystrybutorów." }
            ]
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Czy możecie zrobić doniczki w innych kształtach?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Obecnie oferujemy klasyczne kształty doniczek, ale planujemy rozszerzenie oferty! Jeśli masz konkretny kształt na myśli, napisz do nas - zbieramy sugestie od klientów i uwzględniamy je w rozwoju produktów."
              }
            },
            {
              "@type": "Question",
              "name": "Czy robicie tylko doniczki? Czy możecie zrobić miski dla kotów lub psów?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To świetny pomysł! Aktualnie skupiamy się na doniczkach, ale dzięki właściwościom MKK (bezpieczny, biodegradowalny materiał) miski dla zwierząt są idealną propozycją. Rozważamy taką ofertę - dziękujemy za inspirację!"
              }
            },
            {
              "@type": "Question",
              "name": "Jak długo doniczki zachowują swoje właściwości?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Doniczki z MKK są bardzo trwałe i przy odpowiedniej pielęgnacji mogą służyć przez wiele lat. Materiał naturalnie reguluje wilgotność i jest odporny na standardowe warunki użytkowania. Po zakończeniu ich żywotności są w pełni biodegradowalne."
              }
            },
            {
              "@type": "Question",
              "name": "Czy mogę zamówić doniczki hurtowo dla sklepu ogrodniczego?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Tak! Oferujemy atrakcyjne ceny hurtowe dla sklepów i dystrybutorów. Skontaktuj się z nami przez formularz kontaktowy lub email - przygotujemy indywidualną ofertę dostosowaną do Twoich potrzeb."
              }
            },
            {
              "@type": "Question",
              "name": "Czy doniczki można malować?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutnie! Naturalna powierzchnia MKK doskonale przyjmuje farby. Polecamy farby akwarelowe lub akrylowe - szczegóły znajdziesz w naszym poradniku \"Artystyczne Malowanie Doniczek\" w sekcji Blog."
              }
            },
            {
              "@type": "Question",
              "name": "Jak długo trwa wysyłka?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Standardowa wysyłka trwa 2-3 dni robocze. Wysyłamy kurierem z opcją śledzenia przesyłki. W przypadku zamówień nietypowych lub większych ilości czas realizacji może się wydłużyć - poinformujemy Cię o tym przed wysyłką."
              }
            }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Strona główna",
              "item": "https://cudownadoniczka.pl/"
            }
          ]
        })}</script>
      </Helmet>
      <Header />
      <main>
        <Hero />
        <AboutProduct />
        <CarbonImpactSection />
        <AboutUs />
        <CommunityFAQ />
        <EventsPreview />
        <BlogPreview />
        <ContactForm />
        <HeroSunCursor
          size="large"          // 'small' | 'medium' | 'large'
          glowIntensity="high" // 'low' | 'medium' | 'high' 
          warmth="hot"          // 'cool' | 'warm' | 'hot' 
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
