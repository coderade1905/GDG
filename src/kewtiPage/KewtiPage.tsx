import { Package, Moon, Sun, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import KewtiMascot from '../kewti-mascot/component.tsx';

export default function KewtiPage({ onNavigate }: { onNavigate?: (route: string) => void }) {
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key.toLowerCase() === 'd') {
        setIsDark(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const smoothScrollTo = (e: React.MouseEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText("npm install kewti_components");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden font-sans bg-white dark:bg-black text-black dark:text-white transition-colors duration-200 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="lg:w-[45%] xl:w-[40%] p-6 lg:p-12 lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-700 relative flex flex-col justify-between shrink-0 bg-white dark:bg-black transition-colors duration-200">
        <div className="z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 stroke-[2]" />
            <span className="text-lg font-bold tracking-tight">Kewti</span>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="z-10 max-w-lg mt-16 lg:mt-0 lg:mb-12">
          <div className="mb-4">
            <KewtiMascot />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 leading-relaxed max-w-md">
            Accessible. Customizable. Open Source.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <a
              href="#docs"
              onClick={(e) => smoothScrollTo(e, 'docs')}
              className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition transform hover:scale-[1.02] hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              Get Started
            </a>
            <a href="https://github.com/coderade1905/GDG" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
              GitHub
            </a>
            <button
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('slides');
                }
              }}
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              slides
            </button>
            <button
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('docs');
                } else {
                  smoothScrollTo(e, 'docs');
                }
              }}
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              Documentation
            </button>
          </div>
        </div>

        <div className="hidden lg:flex z-10 items-center justify-between text-sm text-zinc-500 pb-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center space-x-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Toggle Theme (D)"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded border border-zinc-200 bg-zinc-100 text-[10px] uppercase dark:border-zinc-800 dark:bg-zinc-900">
              D
            </div>
            <span>Toggle theme</span>
          </button>
        </div>
      </div>

      <div className="flex-1 lg:w-[55%] xl:w-[60%] overflow-y-auto relative flex flex-col lg:h-screen bg-white/50 dark:bg-black/50 transition-colors duration-200">

        <div className="p-6 lg:p-12 xl:px-16 py-12 max-w-3xl w-full">
          <div id="docs" className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Component library for {' '}
              <span className="bg-gradient-to-r from-[#009A44] from-33% via-[#FED100] via-33% via-66% to-[#EF2B2D] to-66% bg-clip-text text-transparent">
                Ethiopian Apps
              </span></h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              open source Ethiopian component library
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-900 text-zinc-50 mb-12 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-zinc-800 dark:bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-800 dark:bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-800 dark:bg-zinc-700"></div>
              </div>
            </div>
            <div className="p-4 pt-2 flex items-center justify-between font-mono text-sm overflow-x-auto text-zinc-300">
              <div className="flex items-center whitespace-nowrap">
                <span className="text-emerald-400 mr-2">❯</span>
                <span>npm install kewti-components</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={copyCommand}
                  className="ml-4 p-2 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-800 transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                  aria-label="Copy install command"
                  title="Copy install command"
                >
                  {copied ? <Check className="w-4 h-4 text-grey-400" /> : <Copy className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />}
                </button>
                {copied && <span className="ml-2 text-grey-400 text-sm font-medium">Copied!</span>}
                <span aria-live="polite" className="sr-only">{copied ? 'Copied to clipboard' : ''}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full mb-12"></div>

          <div id="components" className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Components</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Explore the available components in the library.
            </p>
          </div>

          <div className="space-y-4">
            <ComponentPlaceholder name="KewtiInput" description="Input field variant with built-in styling and states." />
            <ComponentPlaceholder name="KewtiLocationSelector" description="Cascading dropdowns for selecting regions, zones, woredas, and sub-cities." />
            <ComponentPlaceholder name="KewtiPassword" description="Secure password input field." />
            <ComponentPlaceholder name="KewtiMap" description="Interactive mapping integration for picking location coordinates." />
            <ComponentPlaceholder name="KewtiFonts" description="Custom Ethiopian font application component." />
            <ComponentPlaceholder name="KewtiIcons" description="Comming soon .." />
            <ComponentPlaceholder name="EthiopianCalendar" description="Calendar implementation supporting Gregorian-to-Habeshan date conversions." />
            <ComponentPlaceholder name="TransactionValidator" description="Payment parsing and validation flows for CBE and Telebirr." />
          </div>

          <div className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500">
            Built by <a href="#" className="font-medium underline underline-offset-4 text-zinc-950 dark:text-zinc-50">Kewti</a>. The source code is available on <a href="https://github.com/coderade1905/GDG" className="font-medium underline underline-offset-4 text-zinc-950 dark:text-zinc-50">GitHub</a>.
          </div>

        </div>
      </div>
    </div>
  );
}

function ComponentPlaceholder({ name, description }: { name: string, description: string }) {
  return (
    <> <div tabIndex={0} className="group rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm transform transition-transform hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2">
      <div>
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">{name}</h3>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md">{description}</p>
      </div>
      <div className="shrink-0">
        <div className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors">
          &lt;{name} /&gt;
        </div>
      </div>
    </div>
    </>

  )
}
