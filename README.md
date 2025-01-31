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
- `usePasswordStrength`: Calculate password strength and criteria
- `usePrevious`: Access the previous value of a state or prop
- `useQueue`: Manage a queue with enqueue, dequeue, and reset operations
- `useStepper`: Manage a stepper with customizable steps and actions
- `useWebSocket`: Manage WebSocket connections with automatic reconnection
- `useWindowSize`: Track window dimensions reactively

## Prerequisites

- React 16.8+ (Hooks support)
- TypeScript 4.x+ (for type definitions)
- npm or bun package manager

## Installation

Before installing, you need to configure your package manager to access the GitHub Packages registry.

### GitHub Personal Access Token
First, create a GitHub Personal Access Token with the `read:packages` permission. And add it to your `~/.bunfig.toml` or `~/.npmrc` or `~/.yarnrc` or `~/.pnpmrc` file if you haven't already.

### Via bun

1. Create or edit `$HOME/.bunfig.toml` and add:
```toml
[install.scopes]
"@paulgeorge35" = { token = "your_github_token", url = "https://npm.pkg.github.com/" }
```

2. Install the package:
```bash
bun add @paulgeorge35/hooks@latest
```

### Via npm

1. Create or edit `$HOME/.npmrc` and add:
```
//npm.pkg.github.com/:_authToken=your_github_token
```

2. Install the package:
```bash
npm install @paulgeorge35/hooks@latest
```

### Via yarn

1. Create or edit `$HOME/.yarnrc` and add:
```
//npm.pkg.github.com/:_authToken=your_github_token
```

2. Install the package:
```bash
yarn add @paulgeorge35/hooks@latest
```

### Via pnpm

1. Create or edit `$HOME/.npmrc` and add:
```
//npm.pkg.github.com/:_authToken=your_github_token
```

2. Install the package:
```bash
pnpm add @paulgeorge35/hooks@latest
```

## Usage

### useBoolean Hook

```typescript
import { useBoolean } from '@paulgeorge35/hooks';

function Component() {
  const boolean = useBoolean(false);
  
  return (
    <button onClick={boolean.toggle}>
      {boolean.value ? 'On' : 'Off'}
    </button>
  );
}
```

### useClickOutside Hook

```typescript
import { useClickOutside } from '@paulgeorge35/hooks';

function Modal() {
  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const { ref, triggerRef } = useClickOutside(handleClickOutside);
  
  return (
    <div>
      <button ref={triggerRef} type="button">
        Open Modal
      </button>
      <div ref={ref} className="modal">
        Modal content that can be closed by clicking outside
      </div>
    </div>
  );
}
```

### useCopyToClipboard Hook

```typescript
import { toast } from 'react-toastify';
import { useCopyToClipboard } from '@paulgeorge35/hooks';

function ShareButton() {
  const { copy } = useCopyToClipboard({
    onSuccess: () => toast.success('Copied to clipboard!'),
    onError: (e) => toast.error(e.message)
  });

  return (
    <button onClick={() => copy('Hello, World!')}>
      Share Link
    </button>
  );
}
```

### useDebounce Hook

```typescript
import { useDebounce } from '@paulgeorge35/hooks';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const { value, status, flush, cancel } = useDebounce<string>(search, { 
    delay: 500, 
    updateOnUnmount: true, 
    onUpdate: (value) => console.log('Updated value:', value) 
  });

  return (
    <div>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      <button onClick={flush}>Flush</button>
      <button onClick={cancel}>Cancel</button>

      <p>Current value: {search}</p>
      <p>Debounced value: {value}</p>
      <p>Status: {status}</p>
    </div>
  );
}
```

### useFocus Hook

```typescript
import { useFocus } from '@paulgeorge35/hooks';

function InputComponent() {
  const [ref, isFocused] = useFocus({
    onFocus: () => console.log('Input focused'),
    onBlur: () => console.log('Input blurred')
  });
  
  return (
    <div>
      <div ref={ref} tabIndex={0}>
        {isFocused ? 'Focused!' : 'Click to focus'}
      </div>
      <p>Focus status: {isFocused ? 'Focused' : 'Not focused'}</p>
      <button onClick={() => ref.current?.focus()}>Focus</button>
      <button onClick={() => ref.current?.blur()}>Blur</button>
    </div>
  );
}
```

### useLocalStorage Hook

```typescript
import { useLocalStorage } from '@paulgeorge35/hooks';

function ThemeComponent() {
  const [theme, setTheme, error] = useLocalStorage('theme', 'light');
}
```

### useMediaQuery Hook

```typescript
import { useMediaQuery } from '@paulgeorge35/hooks';

function ResponsiveComponent() {
  const {matches: isMobile} = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### useNumber Hook

```typescript
import { useNumber } from '@paulgeorge35/hooks';

function Counter() {
  const volume = useNumber(50, {
    min: 0,
    max: 100,
    step: 5,
    loop: true,
    float: true,
    precision: 1,
    enableKeyboardControls: true,
    onChange: (value) => updateVolume(value),
    onLimit: (at) => showNotification(`Volume at ${at}`)
  });
  
  return (
    <div>
      <label>
        Volume: {volume.value}%
        <input
          type="range"
          value={volume.value}
          onChange={(e) => volume.setValue(parseFloat(e.target.value))}
          min={0}
          max={100}
          step={5}
        />
      </label>
      <div>
        Delta: {volume.delta > 0 ? '+' : ''}{volume.delta}%
      </div>
    </div>
  );
}
```

### usePasswordStrength Hook

```typescript
import { usePasswordStrength } from '@paulgeorge35/hooks';

function PasswordForm() {
  const [password, setPassword] = useState('');
  const { strength, criteria, score } = usePasswordStrength(password, {
    minLength: 10,
    requireSpecialChar: true,
    requireNumber: true,
    requireMixedCase: true
  });

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak': return 'red';
      case 'medium': return 'orange';
      case 'strong': return 'green';
      case 'very-strong': return 'darkgreen';
      default: return 'gray';
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      
      <div style={{ color: getStrengthColor() }}>
        Password Strength: {strength} ({score}%)
      </div>

      <div className="criteria-list">
        <div>
          Length (min 10): {criteria.minLength ? '✅' : '❌'}
        </div>
        <div>
          Uppercase: {criteria.hasUpperCase ? '✅' : '❌'}
        </div>
        <div>
          Lowercase: {criteria.hasLowerCase ? '✅' : '❌'}
        </div>
        <div>
          Number: {criteria.hasNumber ? '✅' : '❌'}
        </div>
        <div>
          Special Character: {criteria.hasSpecialChar ? '✅' : '❌'}
        </div>
      </div>
    </div>
  );
}
```

### usePrevious Hook

```tsx
import { usePrevious } from '@paulgeorge35/hooks';

function Counter() {
  const [count, setCount] = useState(0);
  const {previous, history, clearHistory} = usePrevious(count);

  return (
    <div>
      <p>Current count: {count}</p>
      <p>Previous count: {previous ?? 'No previous value'}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useQueue Hook

```typescript
import { useQueue } from '@paulgeorge35/hooks';

function TaskManager() {
  const { queue, enqueue, dequeue, reset } = useQueue<{
    id: number;
    task: string;
    priority: 'high' | 'medium' | 'low';
  }>([]);
  
  const addTask = () => {
    enqueue({
      id: Date.now(),
      task: 'New Task',
      priority: 'medium'
    });
  };

  return (
    <div>
      <h2>Task Queue ({queue.length})</h2>
      
      <div className="task-list">
        {queue.map((item) => (
          <div key={item.id} className={`task-item ${item.priority}`}>
            <span>{item.task}</span>
            <span className="priority">{item.priority}</span>
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={addTask}>Add Task</button>
        <button onClick={dequeue} disabled={queue.length === 0}>
          Process Next Task
        </button>
        <button onClick={reset}>Clear All Tasks</button>
      </div>
    </div>
  );
}
```

### useStepper Hook

```typescript
import { useStepper } from '@paulgeorge35/hooks';

function WizardComponent() {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    goToStep,
    isFirstStep,
    isLastStep
  } = useStepper({
    initialStep: 0,
    totalSteps: 3
  });

  return (
    <div>
      <p>Step {currentStep + 1} of {totalSteps}</p>
      {currentStep === 0 && <StepOne />}
      {currentStep === 1 && <StepTwo />}
      {currentStep === 2 && <StepThree />}
      
      <div>
        <button disabled={isFirstStep} onClick={previousStep}>
          Previous
        </button>
        <button disabled={isLastStep} onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
}
```

### useWebSocket Hook

```typescript
import { useWebSocket } from '@paulgeorge35/hooks';

type ChatMessage = {
  text: string;
  timestamp: number;
};

function ChatComponent() {
  const {
    send,
    messages,
    status,
    connect,
    disconnect,
    clearMessages,
    lastError
  } = useWebSocket<ChatMessage>({
    url: 'wss://chat.example.com',
    options: {
      autoConnect: true,
      reconnect: true,
      reconnectInterval: 5000,
      maxRetries: 3,
      onMessage: (msg) => console.log('New message:', msg),
      onError: (error) => console.error('WebSocket error:', error)
    }
  });

  return (
    <div>
      <p>Connection status: {status}</p>
      {lastError && <p>Error: {lastError.message}</p>}
      
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.text} - {new Date(msg.timestamp).toLocaleString()}
          </div>
        ))}
      </div>

      <button onClick={() => send({ text: 'Hello!', timestamp: Date.now() })}>
        Send Message
      </button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={connect}>Reconnect</button>
      <button onClick={clearMessages}>Clear History</button>
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

## Dependencies

##### Peer dependencies
- `react` `(>16.8.0)`
- `react-dom` `(>16.8.0)`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Paul George - contact@paulgeorge.dev

Project Link: [https://github.com/paulgeorge35/hooks](https://github.com/paulgeorge35/hooks)
