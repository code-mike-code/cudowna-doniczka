import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type NfcStatus =
  | 'idle'
  | 'writing'
  | 'confirming'
  | 'success'
  | 'write-error'
  | 'not-locked'
  | 'confirm-error';

const NFC_MESSAGES: Record<Exclude<NfcStatus, 'idle'>, string> = {
  writing: 'Trzymaj telefon przy chipie — zapis i blokada…',
  confirming: 'Chip zablokowany, potwierdzanie na serwerze…',
  success: 'Zapisano i zablokowano ✓',
  'write-error': 'Nie udało się zapisać chipu. Spróbuj ponownie.',
  'not-locked': 'Chip NIE został zablokowany — odłóż doniczkę.',
  'confirm-error':
    'Chip jest zapisany i zablokowany, ale serwer nie potwierdził rejestracji. Ponów potwierdzenie (bez ponownego zapisu).',
};

interface RegisterResult {
  id: string;
  serial_number: string;
  nfc_url: string;
}

const AdminPage = () => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('admin_token')
  );
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [model, setModel] = useState<'S' | 'M' | 'L'>('M');
  const [color, setColor] = useState('');
  const [registering, setRegistering] = useState(false);
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [registerError, setRegisterError] = useState('');
  const [nfcStatus, setNfcStatus] = useState<NfcStatus>('idle');

  // Writing without the ability to lock would leave a chip anyone can overwrite,
  // so require makeReadOnly (Chrome 100+ on Android) up front.
  const nfcSupported =
    'NDEFReader' in window && typeof NDEFReader.prototype.makeReadOnly === 'function';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const loginRes = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (loginRes.ok) {
        const { token: t } = await loginRes.json();
        localStorage.setItem('admin_token', t);
        setToken(t);
        setPassword('');
      } else {
        setLoginError('Nieprawidłowe hasło');
      }
    } catch {
      setLoginError('Błąd połączenia z serwerem');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!color.trim()) { setRegisterError('Podaj kolor'); return; }
    setRegistering(true);
    setRegisterError('');
    setResult(null);
    setNfcStatus('idle');
    try {
      const registerRes = await fetch('/api/admin/register-pot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ model_type: model, color }),
      });
      if (registerRes.ok) {
        setResult(await registerRes.json());
        setColor('');
      } else if (registerRes.status === 401) {
        localStorage.removeItem('admin_token');
        setToken(null);
      } else {
        setRegisterError('Błąd serwera. Spróbuj ponownie.');
      }
    } catch {
      setRegisterError('Błąd połączenia z serwerem');
    } finally {
      setRegistering(false);
    }
  };

  const confirmEncoded = async (potId: string) => {
    setNfcStatus('confirming');
    try {
      const confirmRes = await fetch(`/api/admin/pots/${potId}/confirm-encoded`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (confirmRes.ok) {
        setNfcStatus('success');
      } else {
        // 401 included: keep the result on screen so the confirmation can be retried after re-login
        setNfcStatus('confirm-error');
      }
    } catch {
      setNfcStatus('confirm-error');
    }
  };

  const handleNfcWrite = async () => {
    if (!result) return;
    setNfcStatus('writing');
    const ndef = new NDEFReader();

    try {
      await ndef.write({
        records: [{ recordType: 'url', data: result.nfc_url }],
      });
    } catch {
      setNfcStatus('write-error');
      return;
    }

    // Permanent: after this the chip cannot be rewritten by any phone.
    try {
      await ndef.makeReadOnly();
    } catch {
      setNfcStatus('not-locked');
      return;
    }

    await confirmEncoded(result.id);
  };

  const handleNfcClick = () => {
    if (!result) return;
    if (nfcStatus === 'confirm-error') {
      // Chip is already locked — only the server confirmation is missing.
      void confirmEncoded(result.id);
    } else {
      void handleNfcWrite();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-md mx-auto px-4 pt-24 pb-16 lg:pt-28">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Panel Administracyjny
        </h1>

        {!token ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-destructive">{loginError}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logowanie...' : 'Zaloguj'}
            </Button>
          </form>
        ) : (
          <div className="space-y-8">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-select">Model</Label>
                <Select
                  value={model}
                  onValueChange={(v) => setModel(v as 'S' | 'M' | 'L')}
                >
                  <SelectTrigger id="model-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S — 0.45 kg</SelectItem>
                    <SelectItem value="M">M — 1.20 kg</SelectItem>
                    <SelectItem value="L">L — 1.80 kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Kolor</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="np. naturalny, czarny, biały"
                  required
                />
              </div>

              {registerError && (
                <p className="text-sm text-destructive">{registerError}</p>
              )}

              <Button type="submit" disabled={registering} className="w-full">
                {registering ? 'Rejestrowanie...' : 'Zarejestruj doniczkę'}
              </Button>
            </form>

            {result && (
              <div className="bg-accent/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Doniczka zarejestrowana
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  UUID: {result.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  Nr seryjny: {result.serial_number}
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  URL: {result.nfc_url}
                </p>

                {nfcSupported ? (
                  <>
                    <Button
                      onClick={handleNfcClick}
                      disabled={
                        nfcStatus === 'writing' ||
                        nfcStatus === 'confirming' ||
                        nfcStatus === 'success'
                      }
                      variant="outline"
                      className="w-full"
                    >
                      {nfcStatus === 'idle' && 'Zapisz i zablokuj chip NFC'}
                      {(nfcStatus === 'writing' || nfcStatus === 'confirming') && 'Proszę czekać…'}
                      {nfcStatus === 'success' && 'Gotowe ✓'}
                      {(nfcStatus === 'write-error' || nfcStatus === 'not-locked') &&
                        'Spróbuj ponownie'}
                      {nfcStatus === 'confirm-error' && 'Ponów potwierdzenie'}
                    </Button>
                    {nfcStatus !== 'idle' && (
                      <p
                        role="status"
                        className={`text-sm ${
                          nfcStatus === 'not-locked' ||
                          nfcStatus === 'write-error' ||
                          nfcStatus === 'confirm-error'
                            ? 'text-destructive font-semibold'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {NFC_MESSAGES[nfcStatus]}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Zapis NFC wymaga Chrome (wersja 100+) na Androidzie. Bez zapisu i blokady chipu
                    doniczka nie pojawi się na stronie publicznej.
                  </p>
                )}
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Wyloguj
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
