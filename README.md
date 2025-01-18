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
- `useNumber`: Manage numeric values with increment, decrement, and constraints
- `usePrevious`: Access the previous value of a state or prop
- `useWindowSize`: Track window dimensions reactively

## Prerequisites

- React 16.8+ (Hooks support)
- TypeScript 4.x+ (for type definitions)
- npm or bun package manager

## Installation

Before installing, you need to configure your package manager to access the GitHub Packages registry.

### Via bun

1. Create or edit `$HOME/.bunfig.toml` and add:
```toml
[install.scopes]
"@paulgeorge35" = { token = "${GITHUB_TOKEN}", url = "https://npm.pkg.github.com/" }
```

2. Install the package:
```bash
bun add @paulgeorge35/hooks@latest
```

### Via npm

1. Create or edit `~/.npmrc` and add:
```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. Install the package:
```bash
npm install @paulgeorge35/hooks@latest
```

> Note: Make sure to replace `${GITHUB_TOKEN}` with a GitHub Personal Access Token that has the `read:packages` permission.

## Usage

### useBoolean Hook

```typescript
import { useBoolean } from '@paulgeorge35/hooks';

function Component() {
  const boolean = useBoolean(false);
  
  return (
    <button onClick={boolean.toggle}>
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

### useNumber Hook

```typescript
import { useNumber } from '@paulgeorge35/hooks';

function Counter() {
  const counter = useNumber(0, {
    min: -10,
    max: 10,
    step: 2,
    loop: false
  });
  
  return (
    <div>
      <p>Count: {counter.value}</p>
      <button onClick={() => counter.increase()}>+2</button>
      <button onClick={() => counter.increase(5)}>+5</button>
      <button onClick={() => counter.decrease()}>-2</button>
      <button onClick={counter.reset}>Reset</button>
    </div>
  );
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
