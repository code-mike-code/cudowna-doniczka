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

type NfcStatus = 'idle' | 'writing' | 'success' | 'error';

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

  const [model, setModel] = useState<'S' | 'M' | 'L'>('M');
  const [color, setColor] = useState('');
  const [registering, setRegistering] = useState(false);
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [registerError, setRegisterError] = useState('');
  const [nfcStatus, setNfcStatus] = useState<NfcStatus>('idle');

  const nfcSupported = 'NDEFReader' in window;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        const { token: t } = await r.json();
        localStorage.setItem('admin_token', t);
        setToken(t);
        setPassword('');
      } else {
        setLoginError('Nieprawidłowe hasło');
      }
    } catch {
      setLoginError('Błąd połączenia z serwerem');
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
      const r = await fetch('/api/admin/register-pot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ model_type: model, color }),
      });
      if (r.ok) {
        setResult(await r.json());
        setColor('');
      } else if (r.status === 401) {
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

  const handleNfcWrite = async () => {
    if (!result) return;
    setNfcStatus('writing');
    try {
      // @ts-ignore — Web NFC API not in TS lib yet
      const ndef = new NDEFReader();
      await ndef.write({
        records: [{ recordType: 'url', data: result.nfc_url }],
      });
      setNfcStatus('success');
    } catch {
      setNfcStatus('error');
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
            <Button type="submit" className="w-full">
              Zaloguj
            </Button>
          </form>
        ) : (
          <div className="space-y-8">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={model}
                  onValueChange={(v) => setModel(v as 'S' | 'M' | 'L')}
                >
                  <SelectTrigger>
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
                  <Button
                    onClick={handleNfcWrite}
                    disabled={
                      nfcStatus === 'writing' || nfcStatus === 'success'
                    }
                    variant="outline"
                    className="w-full"
                  >
                    {nfcStatus === 'idle' && 'Zapisz na NFC'}
                    {nfcStatus === 'writing' && 'Zbliż telefon do chipa...'}
                    {nfcStatus === 'success' && 'Zapisano ✓'}
                    {nfcStatus === 'error' && 'Błąd — spróbuj ponownie'}
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Zapis NFC wymaga Chrome na Androidzie.
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
