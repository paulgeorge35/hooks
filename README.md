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
- `useClickOutside`: Detect clicks outside a specified element
- `useCopyToClipboard`: Copy text to clipboard with success state
- `useDebounce`: Debounce rapidly changing values
- `useFocus`: Track focus state of DOM elements
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

### useClickOutside Hook

```typescript
import { useClickOutside } from '@paulgeorge35/hooks';

function Modal() {
  const handleClickOutside = () => {
    // Close the modal when clicking outside
    setIsOpen(false);
  };

  const modalRef = useClickOutside({ callback: handleClickOutside });
  
  return (
    <div ref={modalRef} className="modal">
      Modal content that can be closed by clicking outside
    </div>
  );
}
```

### useCopyToClipboard Hook

```typescript
import { useCopyToClipboard } from '@paulgeorge35/hooks';

function ShareComponent() {
  const { copied, copy } = useCopyToClipboard();
  const textToCopy = "Hello, World!";
  
  return (
    <div>
      <button onClick={() => copy(textToCopy)}>
        {copied ? 'Copied!' : 'Copy Text'}
      </button>
      <p>Share this text: {textToCopy}</p>
    </div>
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

### useFocus Hook

```typescript
import { useFocus } from '@paulgeorge35/hooks';

function InputComponent() {
  const inputRef = useRef<HTMLDivElement>(null);
  const { isFocused } = useFocus({
    ref: inputRef,
    onFocus: () => console.log('Input focused'),
    onBlur: () => console.log('Input blurred')
  });
  
  return (
    <div>
      <div ref={inputRef} tabIndex={0}>
        {isFocused ? 'Focused!' : 'Click to focus'}
      </div>
      <p>Focus status: {isFocused ? 'Focused' : 'Not focused'}</p>
    </div>
  );
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

### usePrevious Hook

```tsx
import { usePrevious } from '@paulgeorge35/hooks';

function Counter() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>Current count: {count}</p>
      <p>Previous count: {previousCount ?? 'No previous value'}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
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

#### Use Cases
- Comparing previous and current values to trigger side effects
- Implementing undo functionality
- Tracking value changes in animations
- Form state management

#### Notes
- Returns `undefined` on the first render
- Updates only after the component has rendered with a new value
- Preserves value type safety through TypeScript generics

## TypeScript Support

The library is written in TypeScript and includes comprehensive type definitions. All hooks are fully typed and provide excellent IDE support.

## Browser Support

- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+
- IE 11 (with appropriate polyfills)

## Dependencies

##### 1. Peer Dependencies
- `react` `(^19.0.0)`: React library with hooks support

##### 2. Development Dependencies (mostly for testing purposes)
- `@happy-dom/global-registrator` `(^16.6.0)`: DOM environment for testing
- `@testing-library/react` `(^16.2.0)`: React testing utilities
- `@testing-library/react-hooks` `(^8.0.1)`: React hooks testing utilities
- `jsdom` `(^26.0.0)`: DOM environment for testing
- `react` `(^19.0.0)`: React development dependency
- `react-dom` `(^19.0.0)`: React DOM development dependency
- `rimraf` `(^6.0.1)`: Cross-platform rm -rf utility
- `typescript` `(^5.7.3)`: TypeScript compiler and types

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Paul George - contact@paulgeorge.dev

Project Link: [https://github.com/paulgeorge35/hooks](https://github.com/paulgeorge35/hooks)
