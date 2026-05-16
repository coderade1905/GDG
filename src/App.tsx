import { useState } from 'react';
import KewtiPage from './kewtiPage/KewtiPage';
import KewtiDocumentation from './kewti-documentation/component';
import KewtiSlidesPage from './kewtiPage/SlidesPage';

export function App() {
  const [route, setRoute] = useState<'home' | 'docs' | 'slides'>('home');

  return (
    <>
      {route === 'home' ? (
        <KewtiPage
          onNavigate={(r: string) => {
            if (r === 'docs') setRoute('docs');
            if (r === 'slides') setRoute('slides');
          }}
        />
      ) : route === 'slides' ? (
        <KewtiSlidesPage onBack={() => setRoute('home')} />
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
