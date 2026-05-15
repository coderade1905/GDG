import React, { useState } from "react";
import { Terminal, Map as MapIcon, Calendar, Lock, CheckCircle, Package, Code, Copy, ChevronLeft, Menu, X, Type } from "lucide-react";
import { KewtiInput } from "../kewti-inputs/component";
import { KewtiMap } from "../kewti-maps/component";
import TransactionValidator from "../kewti-banks/component";
import { EthiopianCalendar } from "../kewti-calender/EthiopianCalendar";
import { KewtiLocationSelector } from "../kewti-regions/component.tsx";
import { KewtiPassword } from "../kewti-passwords/component";
import { EthiopianDatePicker } from "../kewti-calender/DateInput";
import { KewtiFonts } from "../kewti-fonts/component";

const SECTIONS = [
  { id: "installation", title: "Installation", icon: Terminal },
  { id: "kewti-input", title: "Kewti Input", icon: Code },
  { id: "kewti-map", title: "Kewti Map", icon: MapIcon },
  { id: "transaction-validator", title: "Transaction Validator", icon: CheckCircle },
  { id: "ethiopian-calendar", title: "Ethiopian Calendar", icon: Calendar },
  { id: "kewti-location", title: "Location Selector", icon: Package },
  { id: "kewti-password", title: "Password Input", icon: Lock },
  { id: "ethiopian-date", title: "Ethiopian Date Picker", icon: Calendar },
  { id: "kewti-fonts", title: "Kewti Fonts", icon: Type },
];

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border border-border bg-card my-4 md:my-6 rounded-md shadow-sm w-full overflow-hidden">
      <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-[10px] md:text-xs font-mono text-muted-foreground">example code</span>
        <button
          onClick={copyToClipboard}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          title="Copy code"
        >
          {copied ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-foreground" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
        </button>
      </div>
      <div className="p-3 md:p-4 overflow-x-auto w-full">
        <pre className="text-xs md:text-sm font-mono text-foreground w-full">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-6 md:mb-8 border-b border-border pb-4 md:pb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
      {title}
    </h1>
    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const ComponentPreview = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 md:mt-8 border border-border bg-card p-4 sm:p-8 md:p-12 relative rounded-md shadow-sm overflow-x-auto">
    <div className="absolute top-0 left-0 bg-muted/50 text-muted-foreground text-[10px] md:text-xs px-2 py-1 border-b border-r border-border rounded-br-md">
      Preview
    </div>
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto pt-6 md:pt-4">
      {children}
    </div>
  </div>
);

export default function KewtiDocumentation({ onBack }: { onBack?: () => void }) {
  const [activeSection, setActiveSection] = useState("installation");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [, setUserPassword] = useState("");
  const [address, setAddress] = useState<string[]>([]);
  const [userDate, setUserDate] = useState<Date | null>(null);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "installation":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Getting Started"
              description="Learn how to install and integrate Kewti Components into your React project. Clean, minimal, and easy to use."
            />

            <h3 className="text-base md:text-lg font-semibold text-foreground mt-6 md:mt-8 mb-3 md:mb-4 flex items-center">
              <Terminal className="w-4 h-4 mr-2 shrink-0" />
              Installation
            </h3>
            <p className="text-muted-foreground mb-3 md:mb-4 text-xs md:text-sm">Install the package via npm:</p>
            <CodeBlock code="npm i kewti_components" />

            <h3 className="text-base md:text-lg font-semibold text-foreground mt-8 md:mt-10 mb-3 md:mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2 shrink-0" />
              Usage Example
            </h3>
            <p className="text-muted-foreground mb-3 md:mb-4 text-xs md:text-sm">Import any component and use it directly in your React application.</p>
            <CodeBlock
              code={`import { KewtiInput } from "kewti_components";
import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("");

  return (
    <KewtiInput 
      variant="input" 
      setUserInput={setValue} 
    />
  );
}`}
            />
          </div>
        );

      case "kewti-input":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Kewti Input"
              description="A clean, interactive text input component."
            />
            <CodeBlock
              code={`import { KewtiInput } from "kewti_components";

const [input, setInput] = useState("");
<KewtiInput variant="input" setUserInput={setInput} />`}
            />
            <ComponentPreview>
              <div className="w-full max-w-md">
                <KewtiInput variant="input" setUserInput={setUserInput} />
                <p className="mt-4 text-xs md:text-sm text-muted-foreground text-center break-all">
                  Value: <span className="text-foreground font-mono">{userInput || "empty"}</span>
                </p>
              </div>
            </ComponentPreview>
          </div>
        );

      case "kewti-map":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Kewti Map"
              description="A responsive interactive map component built with Leaflet."
            />
            <CodeBlock
              code={`import { KewtiMap } from "kewti_components";

<KewtiMap />`}
            />
            <ComponentPreview>
              <div className="w-full p-1 md:p-2 h-[300px] md:h-[400px] border border-border rounded-md overflow-hidden relative z-0">
                <KewtiMap />
              </div>
            </ComponentPreview>
          </div>
        );

      case "transaction-validator":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Transaction Validator"
              description="A comprehensive UI for validating banking transactions."
            />
            <CodeBlock
              code={`import { TransactionValidator } from "kewti_components";

<TransactionValidator />`}
            />
            <ComponentPreview>
              <div className="w-full overflow-x-auto">
                <TransactionValidator />
              </div>
            </ComponentPreview>
          </div>
        );

      case "ethiopian-calendar":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Ethiopian Calendar"
              description="A calendar component displaying both Gregorian and Ethiopian dates."
            />
            <CodeBlock
              code={`import { EthiopianCalendar } from "kewti_components";

<EthiopianCalendar />`}
            />
            <ComponentPreview>
              <div className="w-full max-w-md overflow-x-auto">
                <EthiopianCalendar />
              </div>
            </ComponentPreview>
          </div>
        );

      case "kewti-location":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Location Selector"
              description="Cascading dropdown selector for Ethiopian regions, zones, and woredas."
            />
            <CodeBlock
              code={`import { KewtiLocationSelector } from "kewti_components";

const [address, setAddress] = useState([]);
<KewtiLocationSelector setAddress={setAddress} />`}
            />
            <ComponentPreview>
              <div className="w-full max-w-md ">
                <KewtiLocationSelector setAddress={setAddress} />
                <p className="mt-4 md:mt-6 text-xs md:text-sm text-muted-foreground text-center">
                  Selected: <span className="text-foreground">{address.length ? address.join(", ") : "None"}</span>
                </p>
              </div>
            </ComponentPreview>
          </div>
        );

      case "kewti-password":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Password Input"
              description="Secure password input field with visibility toggle and strength indicators."
            />
            <CodeBlock
              code={`import { KewtiPassword } from "kewti_components";

const [password, setPassword] = useState("");
<KewtiPassword setUserPassword={setPassword} />`}
            />
            <ComponentPreview>
              <div className="w-full max-w-md">
                <KewtiPassword setUserPassword={setUserPassword} />
              </div>
            </ComponentPreview>
          </div>
        );

      case "ethiopian-date":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Ethiopian Date Picker"
              description="A sleek date picker specifically designed for the Ethiopian calendar system."
            />
            <CodeBlock
              code={`import { EthiopianDatePicker } from "kewti_components";

const [date, setDate] = useState(null);
<EthiopianDatePicker setUserDate={setDate} />`}
            />
            <ComponentPreview>
              <div className="w-full max-w-sm">
                <EthiopianDatePicker setUserDate={setUserDate} />
                <p className="mt-4 md:mt-6 text-xs md:text-sm text-muted-foreground text-center">
                  Selected Date: <span className="text-foreground">{userDate ? userDate.toString() : "None"}</span>
                </p>
              </div>
            </ComponentPreview>
          </div>
        );

      case "kewti-fonts":
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <SectionHeader
              title="Kewti Fonts"
              description="A component for applying custom Ethiopian fonts easily."
            />
            <CodeBlock
              code={`import { KewtiFonts } from "kewti_components";

<KewtiFonts font="menbere">ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል</KewtiFonts>
<KewtiFonts font="mesob">ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል</KewtiFonts>
<KewtiFonts font="geez_digital">ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል</KewtiFonts>`}
            />
            <ComponentPreview>
              <div className="w-full max-w-lg flex flex-col gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">menbere</p>
                  <KewtiFonts font="menbere" className="text-2xl md:text-3xl">ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል</KewtiFonts>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">abinet</p>
                  <KewtiFonts font="abinet" className="text-2xl md:text-3xl">ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል</KewtiFonts>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">geez_digital</p>
                  <KewtiFonts font="geez_digital" className="text-2xl md:text-3xl">ቀስ በ ቀስ እንቁላል በግሩ ይሄዳል</KewtiFonts>
                </div>
              </div>
            </ComponentPreview>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-muted flex flex-col md:flex-row relative">
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
            <Package className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm">Kewti Docs</span>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background/95 backdrop-blur-md border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-muted/30 md:h-screen md:sticky md:top-0 overflow-y-auto ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 md:p-6 min-h-full flex flex-col">
          <div className="mb-6 md:mb-8 flex flex-col gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex w-full items-center gap-2 rounded-lg px-2 md:px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="hidden md:flex flex-col items-start gap-2 px-1">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Kewti Documentation</p>
                <p className="text-xs text-muted-foreground">Component library</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            <div className="mb-2 px-2 md:px-3 text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Getting Started
            </div>
            <button
              onClick={() => handleNavClick("installation")}
              className={`w-full flex items-center px-2 md:px-3 py-2 text-sm rounded-md transition-colors ${activeSection === "installation"
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
            >
              <Terminal className="w-4 h-4 mr-3 shrink-0" />
              <span className="truncate">Installation</span>
            </button>

            <div className="mt-6 mb-2 px-2 md:px-3 text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-4 border-t border-border">
              Components
            </div>

            {SECTIONS.slice(1).map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  className={`w-full flex items-center px-2 md:px-3 py-2 text-sm rounded-md transition-colors ${isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                >
                  <Icon className="w-4 h-4 mr-3 shrink-0" />
                  <span className="truncate">{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-16 overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
}