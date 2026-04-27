import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'O Nas', href: '#about', isCTA: false },
    { name: 'Produkt', href: '#product', isCTA: false },
    // { name: 'Sklep', href: '#shop', isCTA: false },
    // { name: 'Aukcje', href: '#auctions', isCTA: false },
    { name: 'Wydarzenia', href: '#events', isCTA: false },
    { name: 'Blog', href: '#blog', isCTA: false },
    { name: 'Kontakt', href: '#contact', isCTA: false },
    { name: 'Pytania', href: '#faq', isCTA: true },
  ];

  const handleNavigate = (href: string) => {
    const targetId = href.substring(1);
    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: targetId } });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/65 backdrop-blur-sm border-b border-accent shadow-soft">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button onClick={() => handleNavigate('#hero')} className="hover:opacity-80 transition-opacity block">
                <Logo className="h-[60px] w-auto" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-fluid-lg">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.href)}
                className={
                  item.isCTA
                    ? "px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    : "text-foreground hover:text-primary transition-colors duration-300 font-medium"
                }
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute pt-6 pb-6 top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-accent shadow-card animate-fade-in">
            <div className="flex flex-col items-center px-4 py-6 space-y-8">
              {navigationItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.href)}
                  className={
                    item.isCTA
                      ? "px-6 py-3 rounded-full border-2 border-primary text-primary text-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md animate-fade-in-up"
                      : "block text-foreground text-2xl hover:text-primary transition-colors duration-300 font-medium animate-fade-in-up"
                  }
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;