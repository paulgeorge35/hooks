# React Hooks Library

> A collection of essential React hooks for building modern web applications with a focus on simplicity, performance, and developer experience.
> Features TypeScript support, zero dependencies, and comprehensive browser compatibility.

A lightweight TypeScript library that provides a set of commonly used React hooks to enhance your components with powerful functionality.

## Features

- 🎯 Type-safe implementations with TypeScript
- 🪶 Zero external dependencies
- ⚡️ Optimized for performance
- 🧪 Well-tested and production-ready
- 📦 Tree-shakeable exports

## Hooks

- `useBoolean`: Toggle boolean states with predefined actions
- `useDebounce`: Debounce rapidly changing values
- `useLocalStorage`: Persist state in localStorage with type safety
- `useMediaQuery`: React to CSS media query changes
- `usePrevious`: Access the previous value of a state or prop
- `useWindowSize`: Track window dimensions reactively

## Prerequisites

- React 16.8+ (Hooks support)
- TypeScript 4.x+ (for type definitions)
- npm or yarn package manager

## Installation

You can install the hooks library using npm or yarn:

### Via npm

```bash
npm install https://github.com/paulgeorge35/hooks
```

### Via yarn

```bash
yarn add https://github.com/paulgeorge35/hooks
```

## Usage

### useBoolean Hook

```typescript
import { useBoolean } from '@paulgeorge35/hooks';

function Component() {
  const { value, toggle, setTrue, setFalse } = useBoolean(false);
  
  return (
    <button onClick={toggle}>
      {value ? 'On' : 'Off'}
    </button>
  );
}
```

### useDebounce Hook

```typescript
import { useDebounce } from '@paulgeorge35/hooks';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  // debouncedSearch will update only after 500ms of no changes
}
```

### useLocalStorage Hook

```typescript
import { useLocalStorage } from '@paulgeorge35/hooks';

function ThemeComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  // Theme persists across page reloads
}
```

### useMediaQuery Hook

```typescript
import { useMediaQuery } from '@paulgeorge35/hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### useWindowSize Hook

```typescript
import { useWindowSize } from '@paulgeorge35/hooks';

function Component() {
  const { width, height } = useWindowSize();
  
  return <div>Window size: {width} x {height}</div>;
}
```

## TypeScript Support

The library is written in TypeScript and includes comprehensive type definitions. All hooks are fully typed and provide excellent IDE support.

## Browser Support

- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+
- IE 11 (with appropriate polyfills)

## Dependencies

This library has zero external dependencies and only requires React as a peer dependency:
- `react` (^16.8.0): React library with hooks support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Paul George - contact@paulgeorge.dev

Project Link: [https://github.com/paulgeorge35/hooks](https://github.com/paulgeorge35/hooks)
