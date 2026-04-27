import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
