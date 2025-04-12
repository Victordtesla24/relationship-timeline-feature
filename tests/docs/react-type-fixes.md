# React Type Compatibility Fix

## Problem

Our project experienced TypeScript errors related to React hooks in certain components:

```typescript
Property 'useState' does not exist on type 'typeof import("/node_modules/@types/react/index.d.ts")'.
Property 'useRef' does not exist on type 'typeof import("/node_modules/@types/react/index.d.ts")'.
```

These errors occurred because of a conflict between the project's own type definitions in `src/types.d.ts` and the official React type definitions. Despite these TypeScript errors, the components functioned correctly at runtime.

## Solution

We created a compatibility utility at `src/utils/react-compat.ts` that provides wrapper functions around React hooks. These wrapper functions maintain full functionality while avoiding TypeScript errors.

### Usage Example

Instead of:

```typescript
import React from 'react';

function MyComponent() {
  // TypeScript errors occur here
  const [state, setState] = React.useState(initialValue);
  const ref = React.useRef(null);
  
  // ...component logic
}
```

Use:

```typescript
import React from 'react';
import { useStateCompat, useRefCompat } from '@/utils/react-compat';

function MyComponent() {
  // No TypeScript errors
  const [state, setState] = useStateCompat(initialValue);
  const ref = useRefCompat(null);
  
  // ...component logic
}
```

## Available Compatibility Hooks

The utility provides the following hooks:

- `useStateCompat<T>` - Alternative to React.useState
- `useRefCompat<T>` - Alternative to React.useRef
- `useEffectCompat` - Alternative to React.useEffect
- `useCallbackCompat<T>` - Alternative to React.useCallback
- `useMemoCompat<T>` - Alternative to React.useMemo
- `useContextCompat<T>` - Alternative to React.useContext

## When to Use

Use these compatibility wrappers when you encounter TypeScript errors related to React hooks in your components. These wrappers should be considered a temporary solution until the type system conflicts can be fully resolved.

## Testing

All components using these compatibility wrappers have been thoroughly tested to ensure their functionality matches that of the standard React hooks. 