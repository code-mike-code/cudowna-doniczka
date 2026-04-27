import { event1Photos, event2Photos, event3Photos } from './eventPhotos';
import { article1Photo, article2Photo, article3Photo } from './articlePhotos';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  image: string;
  imagePosition?: 'center' | 'top' | 'bottom'; // Nowe pole opcjonalne
  photos?: string[];
}

export const blogPosts: Post[] = [
  {
    id: 1,
    title: 'Jak MKK Pomaga w Walce z Zmianami Klimatycznymi?',
    excerpt: 'Odkryj, w jaki sposób nasze doniczki z Mineralnego Kompozytu Konopnego aktywnie pochłaniają CO₂ z atmosfery i przyczyniają się do ochrony środowiska.',
    content: `
      <h2>Wprowadzenie do Mineralnego Kompozytu Konopnego (MKK)</h2>
      <p>Mineralny Kompozyt Konopny (MKK) to rewolucyjny materiał, który łączy w sobie naturalne włókna konopne z mineralnymi spoiwami. Efektem jest lekki, wytrzymały i, co najważniejsze, ekologiczny materiał budowlany i dekoracyjny. Nasze doniczki są jednym z pierwszych produktów na rynku, które w pełni wykorzystują jego potencjał.</p>
      
      <h2>Proces Pochłaniania CO₂</h2>
      <p>Konopie, będące głównym składnikiem MKK, są jednymi z najszybciej rosnących roślin na świecie. W procesie fotosyntezy intensywnie pochłaniają dwutlenek węgla z atmosfery. Kiedy roślina jest przetwarzana na kompozyt, węgiel ten zostaje trwale zmagazynowany w strukturze materiału. Oznacza to, że każda doniczka Cudowna Doniczka to mały magazyn CO₂, który inaczej unosiłby się w atmosferze.</p>
      
      <h3>Kluczowe Korzyści dla Środowiska:</h3>
      <ul>
        <li><strong>Redukcja śladu węglowego:</strong> Każdy kilogram MKK może zmagazynować do 1.5 kg CO₂.</li>
        <li><strong>Zrównoważona produkcja:</strong> Uprawa konopi nie wymaga pestycydów i zużywa znacznie mniej wody niż bawełna.</li>
        <li><strong>Bioróżnorodność:</strong> Nasze produkty są w pełni biodegradowalne, co oznacza, że po zakończeniu cyklu życia wracają do natury, nie zostawiając po sobie szkodliwych odpadów.</li>
      </ul>

      <h2>Wpływ na Twoje Rośliny</h2>
      <p>Doniczki z MKK nie tylko pomagają planecie, ale także tworzą idealne warunki dla Twoich roślin. Materiał jest porowaty, co zapewnia doskonałą cyrkulację powietrza dla korzeni i naturalnie reguluje wilgotność podłoża. To jak dać roślinom oddychający dom, w którym mogą zdrowo rosnąć.</p>
    `,
    author: 'Dr Anna Kowalska',
    date: '2024-03-15',
    readTime: 5,
    category: 'Ekologia',
    image: article1Photo,
    imagePosition: 'top'
  },
  {
    id: 2,
    title: 'Artystyczne Malowanie Doniczek - Poradnik Krok po Kroku',
    excerpt: 'Naucz się technik malowania doniczek w stylu watercolor. Poznaj sekrety tworzenia pięknych, pastelowych wzorów na naturalnych powierzchniach.',
    content: `
      <h2>Sztuka na Wyciągnięcie Ręki</h2>
      <p>Nasze doniczki to nie tylko ekologiczne rozwiązanie, ale także płótno dla Twojej kreatywności. Ich naturalna, lekko porowata powierzchnia doskonale przyjmuje farbę, pozwalając na tworzenie unikalnych dzieł sztuki. W tym poradniku pokażemy, jak za pomocą prostych technik akwarelowych przemienić zwykłą doniczkę w małe arcydzieło.</p>

      <h2>Czego Potrzebujesz?</h2>
      <ul>
        <li>Doniczka Cudowna Doniczka z MKK</li>
        <li>Farby akwarelowe w ulubionych kolorach</li>
        <li>Pędzle o różnej grubości</li>
        <li>Pojemnik z wodą</li>
        <li>Ręcznik papierowy</li>
      </ul>

      <h2>Instrukcja Krok po Kroku</h2>
      <ol>
        <li><strong>Przygotowanie powierzchni:</strong> Upewnij się, że doniczka jest czysta i sucha. Nie musisz jej gruntować – naturalna faktura MKK doda uroku Twojej pracy.</li>
        <li><strong>Technika "mokre na mokre":</strong> Zwilż pędzlem fragment doniczki czystą wodą. Następnie nałóż na mokrą powierzchnię kroplę rozwodnionej farby. Obserwuj, jak kolor pięknie się rozlewa, tworząc delikatne, pastelowe przejścia.</li>
        <li><strong>Warstwy i detale:</strong> Pozwól pierwszej warstwie wyschnąć. Następnie możesz dodać kolejne warstwy koloru lub za pomocą cieńszego pędzla namalować bardziej precyzyjne wzory – liście, kwiaty czy geometryczne kształty.</li>
        <li><strong>Zabezpieczenie:</strong> Po całkowitym wyschnięciu farby, możesz zabezpieczyć swoje dzieło bezbarwnym, matowym lakierem ekologicznym, aby chronić je przed wilgocią.</li>
      </ol>

      <p>Malowanie doniczek to wspaniały sposób na relaks i wyrażenie siebie. Każda doniczka staje się unikalna, tak jak roślina, która w niej zamieszka. Podziel się swoimi dziełami w mediach społecznościowych, oznaczając nas @CudownaDoniczka!</p>
    `,
    author: 'Magdalena Artystka',
    date: '2024-03-12',
    readTime: 8,
    category: 'Sztuka',
    image: article2Photo,
    imagePosition: 'top'
  },
  {
    id: 3,
    title: 'Fundacja EWC - Nasze Projekty Charytatywne',
    excerpt: 'Poznaj najnowsze inicjatywy Fundacji EWC. Od edukacji ekologicznej po wsparcie lokalnych społeczności - zobacz, jak razem zmieniamy świat.',
    content: `
      <h2>Więcej niż Biznes - Misja Fundacji EWC</h2>
      <p>Cudowna Doniczka narodziła się z pasji do natury i chęci niesienia pomocy. Dlatego każda sprzedana doniczka wspiera działania statutowe Fundacji EWC (Energia Wibracje Częstotliwość). Naszym celem jest budowanie społeczności, która aktywnie działa na rzecz ochrony środowiska i wspiera lokalne inicjatywy.</p>

      <h2>Nasze Główne Obszary Działania</h2>
      
      <h3>Edukacja Ekologiczna Dzieci i Młodzieży</h3>
      <p>Wierzymy, że zmiana zaczyna się od najmłodszych. Organizujemy warsztaty w szkołach i przedszkolach, podczas których uczymy dzieci o znaczeniu recyklingu, ochrony przyrody i zrównoważonego stylu życia. Pokazujemy im, jak małe codzienne wybory mogą mieć ogromny wpływ na naszą planetę.</p>

      <h3>Wsparcie Lokalnych Rzemieślników</h3>
      <p>Współpracujemy z lokalnymi artystami i rzemieślnikami, którzy ręcznie malują nasze doniczki. Dzięki temu nie tylko tworzymy unikalne produkty, ale także wspieramy małe, rodzinne firmy i promujemy tradycyjne rzemiosło.</p>

      <h3>Akcje Sadzenia Drzew</h3>
      <p>Regularnie organizujemy akcje sadzenia drzew w miastach i na terenach zdegradowanych. Każde posadzone drzewo to kolejny krok w walce ze zmianami klimatycznymi i realny wkład w poprawę jakości powietrza, którym oddychamy.</p>

      <h2>Jak Możesz Pomóc?</h2>
      <p>Kupując nasze produkty, stajesz się częścią tej misji. Możesz także dołączyć do nas jako wolontariusz podczas organizowanych wydarzeń lub wesprzeć Fundację EWC bezpośrednią darowizną. Razem możemy więcej!</p>
    `,
    author: 'Zespół Fundacji EWC',
    date: '2024-03-10',
    readTime: 6,
    category: 'Charytatywność',
    image: article3Photo,
    imagePosition: 'top'
  }
];

export const events: Post[] = [

  //  test events posts
    // {
    //   id: 1,
    //   title: 'Warsztaty Malowania Doniczek dla Dzieci',
    //   excerpt: 'Zapraszamy najmłodszych artystów na kreatywne warsztaty, podczas których każde dziecko będzie mogło ozdobić własną ekologiczną doniczkę z MKK.',
    //   content: `
    //     <h2>Dołącz do Naszej Kreatywnej Przygody!</h2>
    //     <p>Czy Twoje dziecko ma duszę artysty? Chcecie spędzić czas w kreatywny i pożyteczny sposób? Zapraszamy na rodzinne warsztaty malowania doniczek z Mineralnego Kompozytu Konopnego! To wyjątkowa okazja, by połączyć zabawę z edukacją ekologiczną.</p>
        
    //     <h3>Co Was Czeka?</h3>
    //     <ul>
    //       <li><strong>Własna Doniczka:</strong> Każdy uczestnik otrzyma jedną z naszych ekologicznych doniczek, która stanie się jego osobistym płótnem.</li>
    //       <li><strong>Ekologiczne Farby:</strong> Zapewniamy bezpieczne, nietoksyczne farby i wszystkie potrzebne materiały.</li>
    //       <li><strong>Instruktaż i Inspiracje:</strong> Nasi artyści pokażą proste techniki malarskie i pomogą uwolnić kreatywność.</li>
    //       <li><strong>Edukacja przez Zabawę:</strong> W przystępny sposób opowiemy, dlaczego nasze doniczki są wyjątkowe i jak pomagają dbać o planetę.</li>
    //     </ul>
  
    //     <h2>Szczegóły Wydarzenia</h2>
    //     <p><strong>Data:</strong> 25 maja 2024 (Sobota)</p>
    //     <p><strong>Godzina:</strong> 12:00 - 14:00</p>
    //     <p><strong>Miejsce:</strong> Park Miejski przy placu zabaw, Warszawa</p>
    //     <p><strong>Wstęp:</strong> Bezpłatny! (Liczba miejsc ograniczona, prosimy o wcześniejszą rezerwację)</p>
  
    //     <p>Po warsztatach każda doniczka będzie gotowa, by zabrać ją do domu i posadzić w niej ulubioną roślinkę. To wspaniała pamiątka i początek domowej przygody z ogrodnictwem. Do zobaczenia!</p>
    //   `,
    //   author: 'Fundacja EWC',
    //   date: '2024-05-25',
    //   readTime: 3,
    //   category: 'Warsztaty',
    //   image: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=800&h=600&fit=crop'
    // },
    // {
    //   id: 2,
    //   title: 'Aukcja Charytatywna Unikalnych Doniczek',
    //   excerpt: 'Weź udział w wyjątkowej aukcji online, z której cały dochód zostanie przeznaczony na wsparcie projektów ekologicznych Fundacji EWC.',
    //   content: `
    //     <h2>Sztuka, Która Pomaga</h2>
    //     <p>Zapraszamy na wyjątkową aukcję charytatywną, podczas której będziesz mieć okazję wylicytować jedyne w swoim rodzaju doniczki, ręcznie malowane przez znanych polskich artystów. To nie tylko szansa na zdobycie unikalnego dzieła sztuki, ale także realne wsparcie dla naszej planety.</p>
  
    //     <h3>Co Będzie Licytowane?</h3>
    //     <p>Na aukcji znajdzie się 10 unikalnych doniczek z MKK, z których każda została przekształcona w małe arcydzieło przez zaproszonych artystów. Każdy przedmiot ma swoją historię i niepowtarzalny charakter.</p>
  
    //     <h2>Cel Aukcji</h2>
    //     <p>Całkowity dochód z aukcji zostanie przeznaczony na realizację dwóch kluczowych celów Fundacji EWC:</p>
    //     <ul>
    //       <li><strong>Projekt "Zielone Miasta":</strong> Sfinansowanie zakupu i posadzenia 1000 drzew na terenach miejskich.</li>
    //       <li><strong>Program "Eko-Liderzy":</strong> Uruchomienie cyklu warsztatów ekologicznych dla 500 dzieci z domów dziecka.</li>
    //     </ul>
  
    //     <h2>Jak Wziąć Udział?</h2>
    //     <p>Aukcja odbędzie się w formie online na naszym profilu na Facebooku.</p>
    //     <p><strong>Start:</strong> 1 czerwca 2024, godz. 18:00</p>
    //     <p><strong>Zakończenie:</strong> 5 czerwca 2024, godz. 20:00</p>
    //     <p>Licytacja odbywa się w komentarzach pod zdjęciami poszczególnych doniczek. Dołącz do wydarzenia na Facebooku, aby otrzymywać powiadomienia i nie przegapić swojej szansy!</p>
    //   `,
    //   author: 'Fundacja EWC',
    //   date: '2024-06-01',
    //   readTime: 4,
    //   category: 'Aukcja',
    //   image: 'https://images.unsplash.com/photo-1611082632392-aa5045fb8324?w=800&h=600&fit=crop'
    // },
    // {
    //   id: 3,
    //   title: 'Webinar: "Zrównoważony Dom - Proste Kroki do Eko-Życia"',
    //   excerpt: 'Dołącz do naszego bezpłatnego webinaru i dowiedz się, jak małymi krokami wprowadzić ekologiczne zmiany w swoim domu i ogrodzie.',
    //   content: `
    //     <h2>Zmień Swój Dom, Zmień Świat</h2>
    //     <p>Chcesz żyć bardziej ekologicznie, ale nie wiesz, od czego zacząć? Ten webinar jest dla Ciebie! Nasza ekspertka, dr Anna Kowalska, w prosty i przystępny sposób opowie, jak wprowadzić zrównoważone nawyki do codziennego życia. Skupimy się na praktycznych poradach, które możesz wdrożyć od zaraz.</p>
  
    //     <h3>Agenda Webinarowa:</h3>
    //     <ul>
    //       <li><strong>Dom bez odpadów (Zero Waste):</strong> Jak ograniczyć ilość śmieci w kuchni i łazience?</li>
    //       <li><strong>Naturalne środki czystości:</strong> Proste przepisy na skuteczne i ekologiczne detergenty.</li>
    //       <li><strong>Kompostowanie dla początkujących:</strong> Jak założyć kompostownik na balkonie lub w ogrodzie?</li>
    //       <li><strong>Ekologiczny ogród:</strong> Jakie rośliny wybrać, by wspierać pszczoły i oszczędzać wodę? Oczywiście, opowiemy też o zaletach doniczek z MKK!</li>
    //       <li><strong>Sesja Q&A:</strong> Na koniec dr Kowalska odpowie na wszystkie Wasze pytania.</li>
    //     </ul>
  
    //     <h2>Informacje Praktyczne</h2>
    //     <p><strong>Data:</strong> 10 czerwca 2024 (Poniedziałek)</p>
    //     <p><strong>Godzina:</strong> 19:00</p>
    //     <p><strong>Platforma:</strong> Zoom (link do spotkania zostanie wysłany zapisanym osobom)</p>
    //     <p><strong>Koszt:</strong> Bezpłatny</p>
  
    //     <p>Zarejestruj się już dziś, aby zarezerwować swoje miejsce. To godzina, która może zmienić Twoje spojrzenie na codzienne nawyki i pokazać, że bycie eko jest proste i przyjemne!</p>
    //   `,
    //   author: 'Dr Anna Kowalska',
    //   date: '2024-06-10',
    //   readTime: 2,
    //   category: 'Webinar',
    //   image: 'https://images.unsplash.com/photo-1588421323978-084a67e3415e?w=800&h=600&fit=crop'
    // },
    {
      id: 1,
      title: 'Relacja z wydarzenia „Cudowna Doniczka” – Warszawa, 31 sierpnia 2025',
      excerpt: 'W ostatnią niedzielę wakacji ogródek kulturalno-gastronomiczny Wolna Wola w Warszawie zamienił się w kolorową przestrzeń pełną sztuki, muzyki i inspiracji.',
      content: `
        <h2>Wstęp</h2>
        <p>W ostatnią niedzielę wakacji ogródek kulturalno-gastronomiczny Wolna Wola w Warszawie zamienił się w kolorową przestrzeń pełną sztuki, muzyki i inspiracji. Wszystko za sprawą wyjątkowego wydarzenia „Cudowna Doniczka”, które połączyło twórczość, technologię i wspólne działanie.</p>
        
        <h2>Start z energią i ideą</h2>
        <p>Punktualnie o godzinie 13:00 prowadzący przywitał uczestników, opowiadając o idei projektu „Cudowna Doniczka”, o tym, jak sztuka codzienności może łączyć ludzi oraz jak ważne jest tworzenie z pasją. Wspomniał też o partnerach medialnych i sponsorach, dzięki którym to wydarzenie mogło się odbyć.</p>
        
        <h2>Malowanie i muzyka</h2>
        <p>O 14:00 uczestnicy ruszyli do stołów, by wspólnie malować doniczki – każda z nich stała się małym dziełem sztuki, pełnym kolorów i emocji. Atmosferę twórczej pracy dopełnił występ Wiktorii Gromowej, która zachwyciła publiczność swoim głosem.</p>
        
        <h2>Dyskusja o technologiach</h2>
        <p>Chwilę później rozpoczął się panel dyskusyjny poświęcony nowym technologiom i ich roli w kulturze. W rozmowie wzięli udział Banaszak, Dębiński, Szczupak oraz Artur Hotel. Dyskusja była pełna ciekawych spostrzeżeń i inspirujących pomysłów.</p>
        
        <h2>Aukcja i muzyczne zakończenie</h2>
        <p>O 17:00 przyszedł czas na aukcję doniczek – emocje sięgały zenitu, a dochód z licytacji wspomoże kolejne inicjatywy artystyczne. Wieczorem, o 19:00, scenę przejęli Marcelina Kopyt & Łukasz Chyliński, tworząc magiczną muzyczną atmosferę na zakończenie dnia.</p>
        
        <h2>Zakończenie pełne wrażeń</h2>
        <p>Event zakończył się o 20:00, pozostawiając uczestników z uśmiechem, nowymi znajomościami i pięknie ozdobionymi doniczkami. „Cudowna Doniczka” udowodniła, że sztuka może kiełkować wszędzie — wystarczy odrobina kreatywności i otwartości.</p>
      `,
      author: 'Zespół Cudowna Doniczka',
      date: '2025-08-31',
      readTime: 5,
      category: 'Relacja',
      image: event1Photos[5],
      photos: event1Photos
    },
    {
      id: 2,
      title: 'Relacja z wydarzenia „Cudowna Doniczka” w Janówkowie',
      excerpt: '29 września 2025 roku w Janówkowie odbyło się niezwykłe wydarzenie „Cudowna Doniczka”, łączące kreatywność, ekologię i lokalną tradycję.',
      content: `
        <h2>Wstęp</h2>
        <p>29 września 2025 roku w Janówkowie (woj. kujawsko-pomorskie) odbyło się niezwykłe wydarzenie pod nazwą „Cudowna Doniczka”, zorganizowane przez Gminę Janówkowo. Tego dnia mieszkańcy oraz goście z całego regionu spotkali się, by wspólnie tworzyć, bawić się i celebrować lokalną kulturę.</p>

        <h2>Kreatywność i ekologia w jednym</h2>
        <p>Główną atrakcją festynu było malowanie doniczek z konopi – ekologicznych i przyjaznych środowisku. Zarówno dzieci, jak i dorośli z zapałem ozdabiali swoje doniczki, tworząc prawdziwe małe dzieła sztuki. Kolorowe prace uczestników można było później podziwiać podczas aukcji, z której dochód został przeznaczony na wsparcie lokalnych inicjatyw społecznych.</p>

        <h2>Rolnicze emocje i tradycja</h2>
        <p>Nie zabrakło także atrakcji dla miłośników rolnictwa i dobrej zabawy. Ogromnym zainteresowaniem cieszyły się wyścigi ciągników, które dostarczyły publiczności mnóstwo emocji. Uczestnicy mogli również zobaczyć pokazy zabytkowego sprzętu rolniczego, przypominające, jak wyglądała praca na wsi przed laty.</p>

        <h2>Smaki i nowoczesność</h2>
        <p>Na gości czekała strefa gastronomiczna, w której lokalni wystawcy serwowali regionalne potrawy i przysmaki. W specjalnej części wystawienniczej zaprezentowali się także producenci i firmy z całego kraju, prezentując nowoczesne technologie rolnicze i rozwiązania wspierające rozwój gospodarstw.</p>

        <h2>Wspólnota i radość tworzenia</h2>
        <p>„Cudowna Doniczka” okazała się wydarzeniem pełnym uśmiechu, wspólnego działania i twórczej energii. Festyn połączył pokolenia, łącząc tradycję z nowoczesnością i pokazując, że Janówkowo to miejsce, gdzie pomysły naprawdę kiełkują.</p>

        <p>Organizatorzy dziękują wszystkim uczestnikom, wystawcom, sponsorom i partnerom za udział i wsparcie wydarzenia. Do zobaczenia za rok na kolejnej edycji Cudownej Doniczki! 🌿</p>
      `,
      author: 'Zespół Cudowna Doniczka',
      date: '2025-09-29',
      readTime: 4,
      category: 'Relacja',
      image: event2Photos[5],
      photos: event2Photos
    },
    {
      id: 3,
      title: 'Relacja z Międzynarodowych Targów GARDENIA 2022',
      excerpt: 'XVI edycja Targów GARDENIA pod hasłem „Ekologiczny ogród” przyciągnęła tłumy. Strefa malowania cudownych doniczek okazała się hitem.',
      content: `
        <h2>Wstęp</h2>
        <p>W dniach 17–19 listopada 2022 roku na terenie Międzynarodowych Targów Poznańskich (MTP) odbyła się XVI edycja Międzynarodowych Targów Ogrodnictwa i Architektury Krajobrazu GARDENIA – największego w Polsce wydarzenia poświęconego branży ogrodniczej. Tegoroczna edycja odbyła się pod hasłem „Ekologiczny ogród”, skupiając uwagę zarówno profesjonalistów, jak i miłośników zieleni na tematach zrównoważonego rozwoju i nowoczesnych rozwiązań przyjaznych środowisku.</p>
        
        <p>W targach uczestniczyło 274 wystawców z 12 krajów, a wydarzenie odwiedziło ponad 12 tysięcy osób z 23 państw. Przez trzy dni hale MTP wypełniły się zielenią, inspiracjami oraz innowacyjnymi pomysłami na tworzenie i pielęgnację ogrodów przyszłości.</p>
        
        <p>Na zwiedzających czekało mnóstwo atrakcji – od prezentacji maszyn i narzędzi ogrodniczych, przez nowoczesne rozwiązania w architekturze krajobrazu, po pokazy florystyczne i warsztaty kreatywne.</p>

        <h2>Malowanie cudownych doniczek – hit tegorocznej edycji</h2>
        <p>Jedną z najchętniej odwiedzanych stref była strefa kreatywna, w której uczestnicy mogli wziąć udział w wyjątkowych warsztatach malowania cudownych doniczek. To połączenie sztuki i natury okazało się strzałem w dziesiątkę – uczestnicy z entuzjazmem tworzyli własne, niepowtarzalne projekty, nadając zwykłym doniczkom nowy, artystyczny charakter. Warsztaty inspirowały do twórczego myślenia o przestrzeni ogrodowej i pokazywały, że ekologia i estetyka mogą iść w parze.</p>

        <h2>Ekologia w centrum uwagi</h2>
        <p>Tegoroczna Gardenia udowodniła, że ekologia to już nie tylko trend, ale standard w rozwoju branży ogrodniczej. Wystawcy zaprezentowali rozwiązania oparte na recyklingu, energooszczędnych technologiach i naturalnych materiałach, a eksperci dzielili się wiedzą na temat zrównoważonego projektowania przestrzeni zielonych.</p>

        <h2>Podsumowanie</h2>
        <p>Międzynarodowe Targi GARDENIA 2022 po raz kolejny potwierdziły swoją pozycję lidera wśród wydarzeń ogrodniczych w Polsce. Była to nie tylko okazja do poznania nowości branżowych i nawiązania kontaktów biznesowych, ale także przestrzeń pełna inspiracji, kreatywności i pasji do natury.</p>
        
        <p>Już teraz czekamy na kolejną edycję – pełną zielonych pomysłów, innowacji i niezwykłych spotkań!</p>
      `,
      author: 'Zespół Cudowna Doniczka',
      date: '2022-11-19',
      readTime: 6,
      category: 'Relacja',
      image: event3Photos[1],
      photos: event3Photos
    }
  ];
