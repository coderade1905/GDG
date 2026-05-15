import { useState } from 'react';
import KewtiPage from './kewtiPage/kewtiPage';
import KewtiDocumentation from './kewti-documentation/component';

export function App() {
  const [route, setRoute] = useState<'home' | 'docs'>('home');

  return (
    <>
      {route === 'home' ? (
        <KewtiPage onNavigate={(r: string) => r === 'docs' && setRoute('docs')} />
      ) : (
        <div className="min-h-screen bg-background text-foreground">
          <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card sticky top-0 z-50">
            <div>
              <span className="text-sm font-semibold">Kewti Documentation</span>
            </div>
            <div />
          </header>
          <main>
            <KewtiDocumentation onBack={() => setRoute('home')} />
          </main>
        </div>
      )}
    </>
  );
}

export default App;
