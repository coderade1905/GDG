import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Package, Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KewtiMascot from '../kewti-mascot/component.tsx';
import { KewtiInput } from '../kewti-inputs/component';
import { KewtiPassword } from '../kewti-passwords/component';
import { KewtiLocationSelector } from '../kewti-regions/component.tsx';
import { EthiopianCalendar } from '../kewti-calender/EthiopianCalendar';
import { EthiopianDatePicker } from '../kewti-calender/DateInput';
import TransactionValidator from '../kewti-banks/component';
import { KewtiMap } from '../kewti-maps/component';
import { KewtiFonts, KewtiPronounce } from '../kewti-fonts/component';

type Props = {
  onBack?: () => void;
};

type SlideSection = {
  id: string;
  nav: string;
  title: string;
  useCase: string;
  description: string;
};

const SLIDE_SECTIONS: SlideSection[] = [
  { id: 'input', nav: 'Input', title: 'Kewti Input', useCase: 'For search bars, login forms, transliteration-friendly typing, and everyday admin panels.', description: 'A responsive input with Ethiopian-language workflows in mind.' },
  { id: 'password', nav: 'Identity', title: 'Kewti Password', useCase: 'For secure sign-up, reset-password, and account verification flows.', description: 'A password field with strength feedback and a mascot-driven experience.' },
  { id: 'location', nav: 'Location', title: 'Location Selector', useCase: 'For forms that need Ethiopian region, zone, and woreda selection.', description: 'A cascading selector built for local address capture.' },
  { id: 'calendar', nav: 'Time', title: 'Ethiopian Calendar', useCase: 'For booking, scheduling, government forms, and calendar-sensitive product flows.', description: 'Ethiopian and Gregorian date handling in one place.' },
  { id: 'date-picker', nav: 'Picker', title: 'Date Picker', useCase: 'For compact date selection inside forms and dashboards.', description: 'A smaller entry point for date capture without losing context.' },
  { id: 'fonts', nav: 'Typography', title: 'Kewti Fonts', useCase: 'For branding, multilingual headlines, and Ethiopian-language product storytelling.', description: 'Typography and pronunciation helpers for local identity.' },
  { id: 'validator', nav: 'Payments', title: 'Bank Transaction Validator', useCase: 'For receipts, cashier tools, reconciliation dashboards, and Telebirr/CBE review.', description: 'OCR-backed validation for transaction confirmation flows.' },
  { id: 'map', nav: 'Maps', title: 'Ethiopian Map', useCase: 'For branch selection, region targeting, logistics, and geo-aware onboarding.', description: 'Interactive region selection for Ethiopian products.' },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-zinc-200 bg-white p-4 text-xs leading-relaxed text-zinc-900 shadow-sm">
      <code>{code}</code>
    </pre>
  );
}

function SampleCard({
  id,
  index,
  title,
  description,
  useCase,
  code,
  children,
  wide = false,
  sectionRef,
}: {
  id: string;
  index: number;
  title: string;
  description: string;
  useCase: string;
  code: string;
  children: React.ReactNode;
  wide?: boolean;
  sectionRef?: (node: HTMLDivElement | null) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = document.getElementById(id);
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [id]);

  const handleRef = (node: HTMLDivElement | null) => {
    sectionRef?.(node);
  };

  return (
    <div
      ref={handleRef}
      id={id}
      className={[
        'scroll-mt-28 transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        wide ? 'md:col-span-2' : '',
      ].join(' ')}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Card className="group bg-white/95 text-zinc-950 shadow-lg backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
            <span>Slide {String(index).padStart(2, '0')}</span>
            <span className="h-px flex-1 bg-emerald-500/30" />
            <span>{title}</span>
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-50 p-4 text-sm leading-6 text-zinc-700">
            <p className="font-semibold text-zinc-950">Use case</p>
            <p className="mt-1">{useCase}</p>
          </div>
          <CodeBlock code={code} />
          <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-4 transition-colors duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-50">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KewtiSlidesPage({ onBack }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [address, setAddress] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState('input');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.15 }
    );

    SLIDE_SECTIONS.forEach((section) => {
      const node = sectionRefs.current[section.id];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const quickStats = [
    ['Ethiopia-first', 'Designed around local workflows and language'],
    ['Open source', 'Built to be copied, adapted, and shipped'],
    ['Live demos', 'Every slide shows the real component'],
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-zinc-50">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Kewti Slides</p>
              <p className="text-xs text-zinc-500">A slide-style walkthrough for Ethiopian dev teams</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBack} className="gap-2 border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <a href="https://github.com/coderade1905/GDG" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50">
              <ExternalLink className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </header>

        <main className="flex-1 space-y-8 py-6 lg:py-8">
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="overflow-hidden border-zinc-200/80 bg-white/90 text-zinc-950 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-6 duration-700">
              <CardContent className="space-y-6 p-6 sm:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 motion-safe:animate-pulse">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ethiopia-first open source component library
                </div>
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Built for Ethiopian developers shipping faster with reusable UI.</h1>
                  <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                    Kewti is an open source React component library tuned for Ethiopian products, dashboards,
                    admin tools, and consumer apps that need local workflows, local typography, and practical forms.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {quickStats.map(([title, body], index) => (
                    <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-50" style={{ animationDelay: `${index * 120 + 120}ms` }}>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-1 text-sm text-zinc-500">{body}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {SLIDE_SECTIONS.map((section) => (
                    <button key={section.id} onClick={() => scrollToSection(section.id)} className={[
                      'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300',
                      activeSection === section.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700'
                        : 'border-zinc-200 bg-white text-zinc-500 hover:border-emerald-400 hover:text-zinc-900',
                    ].join(' ')}>
                      {section.nav}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="flex items-center justify-center border-zinc-200/80 bg-white text-zinc-950 shadow-lg animate-in fade-in slide-in-from-right-8 duration-700">
              <CardContent className="flex w-full flex-col items-center justify-center gap-4 p-6 sm:p-8 lg:p-10">
                <div className="scale-[0.92] sm:scale-100"><KewtiMascot /></div>
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">Kewti</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">A focused toolkit for teams building modern Ethiopian web experiences without starting from scratch.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            <SampleCard id="input" index={1} title="Kewti Input" description="A transliteration-aware input with live state handling." useCase="For search bars, login forms, transliteration-friendly typing, and everyday admin panels." code={`import { KewtiInput } from "kewti_components";

const [value, setValue] = useState("");

<KewtiInput variant="input" setUserInput={setValue} />`} sectionRef={(node) => { sectionRefs.current.input = node; }}>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Best when users need fast text entry with Ethiopian-language support.</p>
              <KewtiInput variant="input" setUserInput={setInputValue} />
              <p className="mt-3 text-sm text-zinc-500">Value: <span className="font-mono text-zinc-900">{inputValue || 'empty'}</span></p>
            </SampleCard>

            <SampleCard id="password" index={2} title="Kewti Password" description="A password field with a strength meter and mascot illustration." useCase="For secure sign-up, reset-password, and account verification flows." code={`import { KewtiPassword } from "kewti_components";

const [password, setPassword] = useState("");

<KewtiPassword setUserPassword={setPassword} />`} sectionRef={(node) => { sectionRefs.current.password = node; }}>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Best when you need a friendly security field that still feels local and polished.</p>
              <KewtiPassword setUserPassword={setPasswordValue} />
              <p className="mt-3 text-sm text-zinc-500">Password length: <span className="font-mono text-zinc-900">{passwordValue.length}</span></p>
            </SampleCard>

            <SampleCard id="location" index={3} title="Location Selector" description="A cascading selector for region, zone, and woreda." useCase="For forms that need Ethiopian region, zone, and woreda selection." code={`import { KewtiLocationSelector } from "kewti_components";

const [address, setAddress] = useState([]);

<KewtiLocationSelector setAddress={setAddress} />`} sectionRef={(node) => { sectionRefs.current.location = node; }}>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Best for onboarding, address capture, branch setup, and location-driven forms.</p>
              <KewtiLocationSelector setAddress={setAddress} />
              <p className="mt-3 text-sm text-zinc-500">Selected: <span className="font-mono text-zinc-900">{address.length ? address.join(', ') : 'None'}</span></p>
            </SampleCard>

            <SampleCard id="calendar" index={4} title="Ethiopian Calendar" description="A date experience that handles Ethiopian calendar workflows." useCase="For booking, scheduling, government forms, and calendar-sensitive product flows." code={`import { EthiopianCalendar } from "kewti_components";

<EthiopianCalendar />`} sectionRef={(node) => { sectionRefs.current.calendar = node; }}>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Best for product flows that must speak the same date language as their users.</p>
              <div className="overflow-auto rounded-xl border border-zinc-200 bg-white p-2"><EthiopianCalendar /></div>
            </SampleCard>

            <SampleCard id="date-picker" index={5} title="Date Picker" description="A compact entry point for selecting a date." useCase="For compact date selection inside forms and dashboards." code={`import { EthiopianDatePicker } from "kewti_components";

<EthiopianDatePicker setUserDate={setSelectedDate} />`} sectionRef={(node) => { sectionRefs.current['date-picker'] = node; }}>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Best for smaller workflows where a full calendar would feel heavy.</p>
              <div className="space-y-3">
                <EthiopianDatePicker setUserDate={(date) => setSelectedDate(date)} />
                <p className="text-sm text-zinc-500">Selected: <span className="font-mono text-zinc-900">{selectedDate ? selectedDate.toDateString() : 'None'}</span></p>
              </div>
            </SampleCard>

            <SampleCard id="fonts" index={6} title="Fonts and Pronunciation" description="Showcase Ethiopian typography and speech playback." useCase="For branding, multilingual headlines, and Ethiopian-language product storytelling." code={`import { KewtiFonts, KewtiPronounce } from "kewti_components";

<KewtiFonts font="geez_digital">እንደምን አለህ</KewtiFonts>
<KewtiPronounce text="እንደምን አለህ" />`} sectionRef={(node) => { sectionRefs.current.fonts = node; }}>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Best for product pages that want Ethiopian typography to feel deliberate, not decorative.</p>
              <div className="space-y-3 text-lg leading-8">
                <KewtiFonts font="geez_digital" className="block text-2xl text-zinc-950">እንደምን አለህ</KewtiFonts>
                <KewtiFonts font="bela_hidase" className="block text-2xl text-zinc-950">ሰላም ለኢትዮጵያ</KewtiFonts>
                <p className="text-sm text-zinc-500">Tap the speaker to hear pronunciation. <KewtiPronounce text="እንደምን አለህ" className="ml-2" /></p>
              </div>
            </SampleCard>

            <SampleCard id="validator" index={7} title="Bank Transaction Validator" description="OCR and transaction verification for payment receipts." useCase="For receipts, cashier tools, reconciliation dashboards, and Telebirr/CBE review." code={`import TransactionValidator from "kewti_components";

<TransactionValidator />`} wide sectionRef={(node) => { sectionRefs.current.validator = node; }}>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Best for fintech teams that need to validate proof of payment quickly.</p>
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white"><TransactionValidator /></div>
            </SampleCard>

            <SampleCard id="map" index={8} title="Ethiopian Map" description="Interactive SVG-based region selection for Ethiopian locations." useCase="For branch selection, region targeting, logistics, and geo-aware onboarding." code={`import { KewtiMap } from "kewti_components";

<KewtiMap />`} wide sectionRef={(node) => { sectionRefs.current.map = node; }}>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Best for apps that need a visual way to choose where work, users, or logistics happen.</p>
              <div className="min-h-190 overflow-hidden rounded-xl border border-zinc-200 bg-white p-2"><KewtiMap /></div>
            </SampleCard>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-zinc-200/80 bg-white/95 text-zinc-950 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-6 duration-700">
              <CardHeader>
                <CardTitle>What this deck tells Ethiopian dev teams</CardTitle>
                <CardDescription>It behaves like a mini product pitch deck and a live demo gallery at the same time.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-6 text-sm leading-6 text-zinc-600">
                <p>• Ethiopia-first positioning for product, fintech, logistics, and admin teams</p>
                <p>• Live component samples with the actual imported code beside them</p>
                <p>• Use-case text before every preview so teams know when to use each component</p>
                <p>• Motion, chips, and hover states to keep the presentation slide-like and interactive</p>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/80 bg-white/95 text-zinc-950 shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-700">
              <CardHeader>
                <CardTitle>Ready for the next slide</CardTitle>
                <CardDescription className="text-zinc-500">Keep scrolling or jump with the chips above. The page stays interactive, not static.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 pb-6">
                <Button variant="secondary" onClick={onBack} className="gap-2 border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"><ArrowLeft className="h-4 w-4" />Back to Kewti</Button>
                <a href="https://github.com/coderade1905/GDG" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"><Terminal className="h-4 w-4" />Source code</a>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
