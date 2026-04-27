export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'produkty' | 'zamówienia' | 'ekologia' | 'inne';
  author?: string;
  date: string;
  helpful?: number;
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'Czy możecie zrobić doniczki w innych kształtach?',
    answer: 'Obecnie oferujemy klasyczne kształty doniczek, ale planujemy rozszerzenie oferty! Jeśli masz konkretny kształt na myśli, napisz do nas - zbieramy sugestie od klientów i uwzględniamy je w rozwoju produktów.',
    category: 'produkty',
    author: 'Anna',
    date: '2024-03-15',
    helpful: 12
  },
  {
    id: 2,
    question: 'Czy robicie tylko doniczki? Czy możecie zrobić miski dla kotów lub psów?',
    answer: 'To świetny pomysł! Aktualnie skupiamy się na doniczkach, ale dzięki właściwościom MKK (bezpieczny, biodegradowalny materiał) miski dla zwierząt są idealną propozycją. Rozważamy taką ofertę - dziękujemy za inspirację!',
    category: 'produkty',
    author: 'Marek',
    date: '2024-03-14',
    helpful: 8
  },
  {
    id: 3,
    question: 'Jak długo doniczki zachowują swoje właściwości?',
    answer: 'Doniczki z MKK są bardzo trwałe i przy odpowiedniej pielęgnacji mogą służyć przez wiele lat. Materiał naturalnie reguluje wilgotność i jest odporny na standardowe warunki użytkowania. Po zakończeniu ich żywotności są w pełni biodegradowalne.',
    category: 'ekologia',
    author: 'Zofia',
    date: '2024-03-13',
    helpful: 15
  },
  {
    id: 4,
    question: 'Czy mogę zamówić doniczki hurtowo dla sklepu ogrodniczego?',
    answer: 'Tak! Oferujemy atrakcyjne ceny hurtowe dla sklepów i dystrybutorów. Skontaktuj się z nami przez formularz kontaktowy lub email - przygotujemy indywidualną ofertę dostosowaną do Twoich potrzeb.',
    category: 'zamówienia',
    author: 'Piotr',
    date: '2024-03-12',
    helpful: 6
  },
  {
    id: 5,
    question: 'Czy doniczki można malować?',
    answer: 'Absolutnie! Naturalna powierzchnia MKK doskonale przyjmuje farby. Polecamy farby akwarelowe lub akrylowe - szczegóły znajdziesz w naszym poradniku "Artystyczne Malowanie Doniczek" w sekcji Blog.',
    category: 'produkty',
    author: 'Kasia',
    date: '2024-03-11',
    helpful: 20
  },
  {
    id: 6,
    question: 'Jak długo trwa wysyłka?',
    answer: 'Standardowa wysyłka trwa 2-3 dni robocze. Wysyłamy kurierem z opcją śledzenia przesyłki. W przypadku zamówień nietypowych lub większych ilości czas realizacji może się wydłużyć - poinformujemy Cię o tym przed wysyłką.',
    category: 'zamówienia',
    date: '2024-03-10',
    helpful: 10
  }
];

// Kategorie dla filtrowania
export const faqCategories = [
  { id: 'wszystkie', label: 'Wszystkie', icon: '📋' },
  { id: 'produkty', label: 'Produkty', icon: '🌱' },
  { id: 'zamówienia', label: 'Zamówienia', icon: '📦' },
  { id: 'ekologia', label: 'Ekologia', icon: '🌍' },
  { id: 'inne', label: 'Inne', icon: '💬' }
] as const;
