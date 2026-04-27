import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Sparkles, Globe } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation'; // Dostosuj ścieżkę do hooka

const AboutUs: React.FC = () => {
  // Hook dla głównego gridu treści – triggeruje animacje dla obu stron
  const { isVisible: isMainContentVisible, ref: mainContentRef } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px' // Wcześniejszy trigger dla immersyjnego efektu
  });

  // Dodatkowy hook dla sekcji header, by separować animację
  const { isVisible: isHeaderVisible, ref: headerRef } = useScrollAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -20px 0px' // Lekko opóźniony dla naturalnego flow
  });

  return (
    <section id="about" className="py-20 section-natural">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header z animacją na scroll */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-800 ease-out ${
            isHeaderVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <h2 className="text-fluid-3xl font-bold text-foreground mb-4">
            O Nas
          </h2>
          <h3 className="text-fluid-xl font-semibold text-primary mb-6">
            Misja, Harmonia i Dobroczynność
          </h3>
        </div>

        {/* Main Content Grid z immersyjnymi animacjami */}
        <div
          ref={mainContentRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 transition-all duration-1000 ease-out ${
            isMainContentVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Mission Story – slide-in z lewej, z subtelnym fade */}
          <div
            className={`space-y-6 transition-all duration-700 ease-out delay-200ms ${
              isMainContentVisible ? 'opacity-100 -translate-x-0 scale-100' : 'opacity-0 -translate-x-12 scale-95'
            }`}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-soft">
              <h4 className="text-2xl font-semibold text-foreground mb-4">
                Nasza Misja
              </h4>
              <p className="text-muted-foreground mb-4">
                Misja Cudowna Doniczka ma na celu uświadamiać nas o konieczności dbania o Naturę i Środowisko. 
                Ma również na celu promocję dobrych zwyczajów i nawyków w codziennym życiu człowieka.
              </p>
              <p className="text-muted-foreground">
                Organizatorzy Projektu Cudowna Doniczka, czyli <strong>Fundacja EWC</strong>, chcą przedstawić 
                światu nowy model postrzegania Siebie i środowiska w harmonii pod hasłem: 
                <span className="text-primary font-semibold"> "OD DONIC PO WSZYSTKO!!!"</span>
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-soft transition-all duration-700 ease-out delay-400ms">
              <h4 className="text-2xl font-semibold text-foreground mb-4">
                Fundacja EWC
              </h4>
              <p className="text-muted-foreground">
                Spełniając marzenia, tworzymy przekaz informacyjny, jak osiągnąć szczęście. 
                W naszych wspólnych działaniach towarzyszy nam Cudownie Artystyczna Grupa, 
                która łączy i jednoczy Wszystkich, którzy chcą nieść dobro przez zabawę i wiedzę.
              </p>
            </div>
          </div>

          {/* Values Cards – stagger slide-in z prawej, z lekkim rotate dla immersji */}
          <div
            className={`space-y-6 transition-all duration-800 ease-out delay-300ms ${
              isMainContentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <Card
              className={`card-natural transition-all duration-600 ease-out delay-300ms transform-gpu ${
                isMainContentVisible ? 'opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100' : 'opacity-0 translate-x-8 translate-y-4 -rotate-2 scale-95'
              }`}
            >
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground mb-2">Cel Społeczny</h5>
                  <p className="text-sm text-muted-foreground">
                    Uświadamianie o potrzebie dbania o środowisko naturalne i promowanie 
                    zrównoważonego rozwoju.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`card-natural transition-all duration-600 ease-out delay-450ms transform-gpu ${
                isMainContentVisible ? 'opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100' : 'opacity-0 translate-x-8 translate-y-2 rotate-1 scale-95'
              }`}
            >
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground mb-2">Społeczność</h5>
                  <p className="text-sm text-muted-foreground">
                    Łączymy ludzi, którzy chcą nieść dobro przez kreatywność, 
                    zabawę i dzielenie się wiedzą.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`card-natural transition-all duration-600 ease-out delay-600ms transform-gpu ${
                isMainContentVisible ? 'opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100' : 'opacity-0 translate-x-8 translate-y-0 -rotate-1 scale-95'
              }`}
            >
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground mb-2">Globalny Zasięg</h5>
                  <p className="text-sm text-muted-foreground">
                    Przekaz dla Wszystkich ludzi mądrych, światłych całego świata – Bez Granic.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`card-natural transition-all duration-600 ease-out delay-750ms transform-gpu ${
                isMainContentVisible ? 'opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100' : 'opacity-0 translate-x-8 translate-y-2 rotate-2 scale-95'
              }`}
            >
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground mb-2">Filozofia Piękna</h5>
                  <p className="text-sm text-muted-foreground">
                    "Gdy piękno pochodzi z wnętrza, to głuchy je usłyszy, a ślepy zobaczy. 
                    To Afirmacja Miłości."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action – jeśli odkomentujesz, dodaj podobną animację */}
        {/* <div className="text-center transition-all duration-800 ease-out delay-800ms">
          ... (dodaj ref i klasy jak wyżej)
        </div> */}
      </div>
    </section>
  );
};

export default AboutUs;
