# Kewti Components

A modern React component library focused on delivering high-quality, reusable components with built-in support for Ethiopian contexts (such as calendars, locations, and typography).

## Installation

Install the package via npm:

```bash
npm install kewti_components
```

Make sure you have `react` and `react-dom` installed, as they are required peer dependencies.

## Usage

Import components directly into your React application.

```tsx
import { useState } from "react";
import { KewtiInput, EthiopianCalendar } from "kewti_components";

export default function App() {
  const [value, setValue] = useState("");

  return (
    <div className="p-4">
      <KewtiInput variant="input" setUserInput={setValue} />
      <EthiopianCalendar />
    </div>
  );
}
```

## Available Components

- **Kewti Input**: Clean, interactive text input components.
- **Kewti Map**: Responsive interactive maps built with Leaflet.
- **Transaction Validator**: Comprehensive UI for validating banking transactions.
- **Ethiopian Calendar**: Calendar component displaying both Gregorian and Ethiopian dates.
- **Ethiopian Date Picker**: Date picker designed for the Ethiopian calendar system.
- **Location Selector**: Cascading dropdown selector for Ethiopian regions, zones, and woredas.
- **Password Input**: Secure password input field with visibility toggle and strength indicators.
- **Kewti Fonts**: Utility component for applying custom Ethiopian fonts (`geez_digital`, `bela_hidase`).

## Development

To view the components in action and explore their APIs, you can run the local documentation site:

```bash
npm run dev
```

To build the library for production:

```bash
npm run build
```

## License

MIT
