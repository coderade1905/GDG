import React, { useState } from "react";
import { Terminal, Map as MapIcon, Calendar, Lock, CheckCircle, Package, Code, Copy, ChevronLeft } from "lucide-react";
import { KewtiInput } from "../kewti-inputs/component";
import { KewtiMap } from "../kewti-maps/component";
import TransactionValidator from "../kewti-banks/component";
import { EthiopianCalendar } from "../kewti-calender/EthiopianCalendar";
import { KewtiLocationSelector } from "../kewti-regions/component";
import { KewtiPassword } from "../kewti-passwords/component";
import { EthiopianDatePicker } from "../kewti-calender/DateInput";

const SECTIONS = [
  { id: "installation", title: "Installation", icon: Terminal },
  { id: "kewti-input", title: "Kewti Input", icon: Code },
  { id: "kewti-map", title: "Kewti Map", icon: MapIcon },
  { id: "transaction-validator", title: "Transaction Validator", icon: CheckCircle },
  { id: "ethiopian-calendar", title: "Ethiopian Calendar", icon: Calendar },
  { id: "kewti-location", title: "Location Selector", icon: Package },
  { id: "kewti-password", title: "Password Input", icon: Lock },
  { id: "ethiopian-date", title: "Ethiopian Date Picker", icon: Calendar },
];

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border border-border bg-card my-6 rounded-md shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-xs font-mono text-muted-foreground">example code</span>
        <button
          onClick={copyToClipboard}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Copy code"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-foreground" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-8 border-b border-border pb-6">
    <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
      {title}
    </h1>
    <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
  </div>
);

const ComponentPreview = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-8 border border-border bg-card p-8 md:p-12 relative rounded-md shadow-sm">
    <div className="absolute top-0 left-0 bg-muted/50 text-muted-foreground text-xs px-2 py-1 border-b border-r border-border rounded-br-md">
      Preview
    </div>
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto pt-4">
      {children}
    </div>
  </div>
);

export default function KewtiDocumentation({ onBack }: { onBack?: () => void }) {
  const [activeSection, setActiveSection] = useState("installation");

  const [userInput, setUserInput] = useState("");
  const [, setUserPassword] = useState("");
  const [address, setAddress] = useState<string[]>([]);
  const [userDate, setUserDate] = useState<Date | null>(null);

  const renderContent = () => {
    switch (activeSection) {
      case "installation":
        return (
          <div className="animate-in fade-in duration-500">
            <SectionHeader
              title="Getting Started"
              description="Learn how to install and integrate Kewti Components into your React project. Clean, minimal, and easy to use."
            />

            <h3 className="text-lg font-semibold text-foreground mt-8 mb-4 flex items-center">
              <Terminal className="w-4 h-4 mr-2" />
              Installation
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">Install the package via npm:</p>
            <CodeBlock code="npm i kewti_components" />

            <h3 className="text-lg font-semibold text-foreground mt-10 mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Usage Example
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">Import any component and use it directly in your React application.</p>
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
          <div className="animate-in fade-in duration-500">
            <SectionHeader
              title="Kewti Input"
              description="A clean, interactive text input component."
            />
            <CodeBlock
              code={`import { KewtiInput } from "kewti_components";

// Inside your component:
const [input, setInput] = useState("");
<KewtiInput variant="input" setUserInput={setInput} />`}
            />
            <ComponentPreview>
              <div className="w-full max-w-md">
                <KewtiInput variant="input" setUserInput={setUserInput} />
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Value: <span className="text-foreground font-mono">{userInput || "empty"}</span>
                </p>
              </div>
            </ComponentPreview>
          </div>
        );

      case "kewti-map":
        return (
          <div className="animate-in fade-in duration-500">
            <SectionHeader
              title="Kewti Map"
              description="A responsive interactive map component built with Leaflet."
            />
            <CodeBlock
              code={`import { KewtiMap } from "kewti_components";

// Render where needed:
<KewtiMap />`}
            />
            <ComponentPreview>
              <div className="w-full p-2 h-[400px] border border-border rounded-md overflow-hidden">
                <KewtiMap  />
              </div>
            </ComponentPreview>
          </div>
        );

      case "transaction-validator":
        return (
          <div className="animate-in fade-in duration-500">
            <SectionHeader
              title="Transaction Validator"
              description="A comprehensive UI for validating banking transactions."
            />
            <CodeBlock
              code={`import { TransactionValidator } from "kewti_components";

<TransactionValidator />`}
            />
            <ComponentPreview>
              <TransactionValidator />
            </ComponentPreview>
          </div>
        );

      case "ethiopian-calendar":
        return (
          <div className="animate-in fade-in duration-500">
            <SectionHeader
              title="Ethiopian Calendar"
              description="A calendar component displaying both Gregorian and Ethiopian dates."
            />
            <CodeBlock
              code={`import { EthiopianCalendar } from "kewti_components";

<EthiopianCalendar />`}
            />
            <ComponentPreview>
              <div className="w-full max-w-md">
                <EthiopianCalendar />
              </div>
            </ComponentPreview>
          </div>
        );

      case "kewti-location":
        return (
          <div className="animate-in fade-in duration-500">
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
              <div className="w-full max-w-md">
                <KewtiLocationSelector setAddress={setAddress} />
                <p className="mt-6 text-sm text-muted-foreground text-center">
                  Selected: <span className="text-foreground">{address.length ? address.join(", ") : "None"}</span>
                </p>
              </div>
            </ComponentPreview>
          </div>
        );

      case "kewti-password":
        return (
          <div className="animate-in fade-in duration-500">
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
          <div className="animate-in fade-in duration-500">
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
                <p className="mt-6 text-sm text-muted-foreground text-center">
                  Selected Date: <span className="text-foreground">{userDate ? userDate.toString() : "None"}</span>
                </p>
              </div>
            </ComponentPreview>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-muted">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className="sticky top-0 z-40 w-full md:w-64 md:shrink-0 h-screen bg-muted/30 border-b md:border-b-0 md:border-r border-border overflow-hidden overscroll-none"
        >
          <div className="p-6">
            <div className="mb-8 flex flex-col gap-4">
              <button
                type="button"
                onClick={onBack}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <div className="flex flex-col items-start gap-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Kewti Documentation</p>
                  <p className="text-xs text-muted-foreground">Component library</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Getting Started
              </div>
              <button
                onClick={() => setActiveSection("installation")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${activeSection === "installation"
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
              >
                <Terminal className="w-4 h-4 mr-3" />
                Installation
              </button>

              <div className="mt-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-4 border-t border-border">
                Components
              </div>

              {SECTIONS.slice(1).map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside >

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-16">
          {renderContent()}
        </main>
      </div>
    </div >
  );
}
