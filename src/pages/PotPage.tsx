import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarbonImpactSection, { PotData } from '@/components/CarbonImpactSection';

type Status = 'loading' | 'ok' | 'notfound' | 'error';

interface PotResponse extends PotData {
  id: string;
  serial_number: string;
}

const PotPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [pot, setPot] = useState<PotResponse | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!uuid) { setStatus('notfound'); return; }

    const controller = new AbortController();

    fetch(`/api/pot/${uuid}`, { signal: controller.signal })
      .then((r) => {
        if (r.status === 404) { setStatus('notfound'); return null; }
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data) { setPot(data); setStatus('ok'); }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, [uuid]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28">
        {status === 'loading' && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {(status === 'error' || status === 'notfound') && (
          <div className="text-center py-32 px-4">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {status === 'notfound'
                ? 'Doniczka nie znaleziona'
                : 'Błąd połączenia'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {status === 'notfound'
                ? 'Ta doniczka nie istnieje w naszej bazie danych.'
                : 'Nie można pobrać danych. Spróbuj ponownie.'}
            </p>
            <Link to="/" className="text-primary hover:underline">
              Wróć na stronę główną
            </Link>
          </div>
        )}

        {status === 'ok' && pot && (
          <>
            <div className="text-center py-6 px-4">
              <p className="text-sm text-muted-foreground">
                Nr seryjny: {pot.serial_number}
              </p>
            </div>
            <CarbonImpactSection potData={pot} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PotPage;
