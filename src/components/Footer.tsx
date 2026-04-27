import { Logo } from '@/components/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: 'O Nas', href: '#about' },
    { name: 'Produkty', href: '#product' },
    // { name: 'Sklep', href: '#shop' },
    // { name: 'Aukcje', href: '#auctions' },
    { name: 'Wydarzenia', href: '#events' },
    { name: 'Blog', href: '#blog' },
    { name: 'Kontakt', href: '#contact' }
  ];

  const legalLinks = [
    { name: 'Polityka Prywatności', href: '/privacy' },
  ];

  return (
    <footer className="bg-gradient-to-b from-accent/20 to-accent/40 border-t border-accent">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Logo className="h-[60px] w-auto" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ekologiczne doniczki z Mineralnego Kompozytu Konopnego, które pochłaniają CO₂ 
              i wspierają działalność charytatywną Fundacji EWC.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">
                "Od Donic Po Wszystko!"
              </p>
              <p className="text-xs text-muted-foreground italic">
                Namaluj swój świat na nowo!
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground">Nawigacja</h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

      

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground">Współpraca</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Fundacja EWC
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Wspieramy ekologię i działalność charytatywną
                  </p>
                </div>
              </div>
              
              {/* <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-medium">Adres</p>
                  <p className="text-sm text-muted-foreground">
                    ul. Ekologiczna 123<br />
                    00-001 Warszawa, Polska
                  </p>
                </div>
              </div> */}
            </div>

            {/* Social Media */}
            {/* <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">Śledź nas</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 hover:bg-primary/20 hover:text-primary"
                      asChild
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                      >
                        <IconComponent className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div> */}
          </div>

              {/* Legal & Support */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground">Pomoc i Informacje</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-accent bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Cudowna Doniczka - Fundacja EWC. Wszelkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;