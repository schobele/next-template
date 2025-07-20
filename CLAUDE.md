# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 template repository built with:

- TypeScript
- Tailwind CSS v4
- Prisma with PostgreSQL
- Better Auth
- React Email
- Resend
- Shadcn/ui
- Ultracite
- Bun
- zod
- motion (formely framer-motion)
- ai / @ai-sdk/openai

## Key Commands

### Development

```bash
# Code quality checks and auto-fix (biome)
bun run lint-and-format

# Type check (tsc --noEmit)
bun run typecheck

# Run a specific test file
bun test path/to/specific.test.ts

# Run all tests
bun test
```

Adopt a philosophy rooted in **Domain-Driven Design (DDD)** and **Vertical Slicing**. Instead of organizing code by technical layers (e.g., `controllers`, `services`, `models`), we organize it by business features or "domains." This makes the codebase easier to navigate, maintain, and scale as the application grows.

### 1. Core Philosophy: Vertical Slicing & DDD

For a modern, production-ready application, we move away from the traditional horizontal (layer-based) architecture.

- **Horizontal Slicing (The Old Way):** A feature change requires you to jump between `models`, `views`, and `controllers` folders, which are often far apart. This increases cognitive load.
- **Vertical Slicing (The New Way):** All the code for a single feature—UI components, server-side logic, data queries, and types—lives together in the same directory. When you work on the "user profile" feature, you work inside the `features/user-profile` directory. This colocation is the key to maintainability.

This approach pairs perfectly with Next.js App Router, React Server Components (RSC), and Server Actions, which naturally encourage grouping server and client logic by route or feature.

### 2. The Repository Structure

This structure separates Next.js routing concerns from your core application logic, providing clarity and scalability.

```plaintext
.
├── app/                      # Next.js App Router (Routing and Layouts)
│   ├── (app)/                # Authenticated application routes
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── (public)/          # Public routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                  # API routes (webhooks, etc. -> e.g. /api/posts/events)
│   │   └── ...
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
│
├── components/           # Shared, global components
│   ├── ui/               # UI primitives (e.g., shadcn/ui Button, Card)
│   └── shared/           # Complex shared components (e.g., PageHeader)
│
├── features/             # ✨ VERTICAL SLICES (The heart of the app)
│   ├── posts/            # Example feature (posts)
│   │   ├── components/   # Components specific to 'posts'
│   │   │   ├── post-card.tsx
│   │   │   └── create-post-form.tsx
│   │   ├── api/          # API routes for 'posts'
│   │   │   └── events.ts # Route handlers for post webhooks
│   │   ├── queries.ts    # Data fetching functions for 'posts'
│   │   ├── service.ts    # Service layer for 'posts'
│   │   ├── actions.ts    # Server Actions for 'posts'
│   │   ├── hooks.ts      # Custom hooks for 'posts'
│   │   └── types.ts      # TypeScript types for 'posts'
│   │
│   └── auth/
│       ├── ...           # Same structure for the 'auth' domain
│
├── lib/                  # Low-level utilities and configurations
│   ├── auth.ts           # Authentication config (e.g., NextAuth.js)
│   ├── db/               # Database client, schema, and migrations
│   ├── utils.ts          # General helper functions (e.g., cn)
│   └── validators/       # Zod schemas for data validation
│
├── hooks/                # Shared, global custom React hooks
├── config/               # Application-wide configuration
└── types/                # Global TypeScript types
│
├── public/                   # Static assets (images, fonts)
├── scripts/                  # Standalone scripts (e.g., DB seeding)
├── tailwind.config.ts
└── tsconfig.json
```

### 3. Data Flow: RSC, Server Actions, and Queries

This architecture fully embraces the server-centric model of the Next.js App Router.

#### **Data Fetching: Server Components First**

By default, all data fetching should happen on the server, inside React Server Components (RSCs).

1. **Define Queries:** Create reusable data-fetching functions in your feature's `queries.ts` file. These functions can directly access your database.
2. **Call from RSCs:** Import and `await` these query functions directly within your `page.tsx` or server-only layout files.

This pattern eliminates the need for API endpoints for data fetching and avoids client-side request waterfalls, resulting in faster page loads.

#### **Data Mutations: Server Actions**

All data creations, updates, and deletions should be handled by Server Actions.

1. **Define Actions:** Create your Server Actions in the feature's `actions.ts` file. These are async functions marked with the `"use server";` directive. They contain the logic to mutate data in your database.
2. **Validate Input:** Use a library like Zod inside your Server Actions to validate the incoming data. Never trust the client.
3. **Invoke from Client:** Call these actions from your client components, typically within a form's `action` prop or an event handler. Use React's `useFormState` and `useFormStatus` hooks to handle pending states, errors, and optimistic updates without complex client-side state management.

This approach keeps mutation logic on the server, enhances security, and dramatically simplifies form handling on the client.

### 4. Key Takeaways & Best Practices

- **Embrace the Server:** Do as much as you can on the server. Fetch data, mutate data, and render components there. Only use `"use client"` when you absolutely need interactivity, state, or browser-only APIs.
- **Colocate by Feature:** The `features` directory is your most important asset for long-term maintainability. Be disciplined about keeping feature-specific logic inside its designated slice.
- **`lib` is for Truly Shared Code:** The `lib` directory should only contain code that is generic and can be used by _any_ feature (e.g., database client, auth config, date formatters). If code is only used by one or two features, it's better to keep it within those features.
- **Validation is Non-Negotiable:** Always validate data on the server within your Server Actions before it touches your database. Zod is the industry standard for this.
- **Keep Client State Simple:** The combination of RSC and Server Actions drastically reduces the need for complex client-side state managers like Redux or Zustand. Start with `useState` and `useReducer`. Reach for more powerful tools only when component prop drilling becomes a significant problem.
- **Composition over Inheritance:** Use composition to build complex components rather than extending base classes. Component Composition with `children` is the preferred way to build complex components.

This architecture provides a robust foundation for building a production-grade Next.js application that is a pleasure to work on, easy to scale, and fast for your users.

## Architecture Overview

### Authentication System (Better Auth)

The authentication system (`/lib/auth/index.ts`) is the core of this template, implementing:

- Multiple authentication methods (email/password, OAuth, magic links)
- OAuth providers: Google, GitHub, Microsoft
- Advanced features: 2FA, passkeys, organizations, multi-session
- Email verification and password reset flows
- Session management with secure cookies

### Route Structure

- `/app/(auth)/` - Authentication route group containing sign-in, password reset, 2FA, and invitation pages
- `/app/api/auth/[...all]/` - Catch-all API route for Better Auth
- `/app/dashboard/` - Protected area requiring authentication
- `/middleware.ts` - Route protection logic

### Database Architecture

Uses Prisma ORM with PostgreSQL:

- **User** - Core user data with email verification status
- **Session** - Active user sessions with device info
- **Account** - OAuth provider accounts and credentials
- **Verification** - Email verification tokens

### Email System

Email templates use React Email components with Resend:

- Magic link authentication
- Password reset
- Organization invitations
- Email verification

## Code Style Guidelines

The project uses Ultracite (Biome) for code quality with strict rules:

- Maximum type safety enforced
- Comprehensive accessibility standards
- No console logs, debugger statements, or any types
- Prefer modern JavaScript features (optional chaining, nullish coalescing)
- Use const for immutable values
- Arrow functions preferred over function expressions

## Important Patterns

### Protected Routes

Routes are protected using middleware that checks for valid sessions:

```typescript
// Protected routes start with /dashboard
if (pathname.startsWith("/dashboard")) {
	// Check session validity
}
```

### Server Actions

Use the pattern from `/lib/utils/actions.ts` for consistent error handling:

```typescript
export async function actionWithState<T>() {
	try {
		// Action logic
		return { success: true, data: result };
	} catch (error) {
		return { success: false, error: error.message };
	}
}
```

### Component Organization

- UI components from shadcn/ui are in `/components/ui/`
- Authentication components are in `/components/`
- Use existing UI components before creating new ones

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret
- `RESEND_API_KEY` - Email service API key
- OAuth provider credentials (GitHub, Google, Microsoft)
- `NEXT_PUBLIC_APP_URL` - Application URL for redirects

## Common Development Tasks

### Modifying Email Templates

1. Edit React Email components in `/lib/email/`
2. Test locally with development email settings
3. Ensure responsive design for email clients

## Using Bun

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

### APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

### Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Ultracite Context

Ultracite enforces strict type safety, accessibility standards, and consistent code quality for JavaScript/TypeScript projects using Biome's lightning-fast formatter and linter.

### Key Principles

- Zero configuration required
- Subsecond performance
- Maximum type safety
- AI-friendly code generation

### Before Writing Code

1. Analyze existing patterns in the codebase
2. Consider edge cases and error scenarios
3. Follow the rules below strictly
4. Validate accessibility requirements

### Rules

#### Accessibility (a11y)

- Don't use `accessKey` attribute on any HTML element.
- Don't set `aria-hidden="true"` on focusable elements.
- Don't add ARIA roles, states, and properties to elements that don't support them.
- Don't use distracting elements like `<marquee>` or `<blink>`.
- Only use the `scope` prop on `<th>` elements.
- Don't assign non-interactive ARIA roles to interactive HTML elements.
- Make sure label elements have text content and are associated with an input.
- Don't assign interactive ARIA roles to non-interactive HTML elements.
- Don't assign `tabIndex` to non-interactive HTML elements.
- Don't use positive integers for `tabIndex` property.
- Don't include "image", "picture", or "photo" in img alt prop.
- Don't use explicit role property that's the same as the implicit/default role.
- Make static elements with click handlers use a valid role attribute.
- Always include a `title` element for SVG elements.
- Give all elements requiring alt text meaningful information for screen readers.
- Make sure anchors have content that's accessible to screen readers.
- Assign `tabIndex` to non-interactive HTML elements with `aria-activedescendant`.
- Include all required ARIA attributes for elements with ARIA roles.
- Make sure ARIA properties are valid for the element's supported roles.
- Always include a `type` attribute for button elements.
- Make elements with interactive roles and handlers focusable.
- Give heading elements content that's accessible to screen readers (not hidden with `aria-hidden`).
- Always include a `lang` attribute on the html element.
- Always include a `title` attribute for iframe elements.
- Accompany `onClick` with at least one of: `onKeyUp`, `onKeyDown`, or `onKeyPress`.
- Accompany `onMouseOver`/`onMouseOut` with `onFocus`/`onBlur`.
- Include caption tracks for audio and video elements.
- Use semantic elements instead of role attributes in JSX.
- Make sure all anchors are valid and navigable.
- Ensure all ARIA properties (`aria-*`) are valid.
- Use valid, non-abstract ARIA roles for elements with ARIA roles.
- Use valid ARIA state and property values.
- Use valid values for the `autocomplete` attribute on input elements.
- Use correct ISO language/country codes for the `lang` attribute.

#### Code Complexity and Quality

- Don't use consecutive spaces in regular expression literals.
- Don't use the `arguments` object.
- Don't use primitive type aliases or misleading types.
- Don't use the comma operator.
- Don't use empty type parameters in type aliases and interfaces.
- Don't write functions that exceed a given Cognitive Complexity score.
- Don't nest describe() blocks too deeply in test files.
- Don't use unnecessary boolean casts.
- Don't use unnecessary callbacks with flatMap.
- Use for...of statements instead of Array.forEach.
- Don't create classes that only have static members (like a static namespace).
- Don't use this and super in static contexts.
- Don't use unnecessary catch clauses.
- Don't use unnecessary constructors.
- Don't use unnecessary continue statements.
- Don't export empty modules that don't change anything.
- Don't use unnecessary escape sequences in regular expression literals.
- Don't use unnecessary fragments.
- Don't use unnecessary labels.
- Don't use unnecessary nested block statements.
- Don't rename imports, exports, and destructured assignments to the same name.
- Don't use unnecessary string or template literal concatenation.
- Don't use String.raw in template literals when there are no escape sequences.
- Don't use useless case statements in switch statements.
- Don't use ternary operators when simpler alternatives exist.
- Don't use useless `this` aliasing.
- Don't use any or unknown as type constraints.
- Don't initialize variables to undefined.
- Don't use the void operators (they're not familiar).
- Use arrow functions instead of function expressions.
- Use Date.now() to get milliseconds since the Unix Epoch.
- Use .flatMap() instead of map().flat() when possible.
- Use literal property access instead of computed property access.
- Don't use parseInt() or Number.parseInt() when binary, octal, or hexadecimal literals work.
- Use concise optional chaining instead of chained logical expressions.
- Use regular expression literals instead of the RegExp constructor when possible.
- Don't use number literal object member names that aren't base 10 or use underscore separators.
- Remove redundant terms from logical expressions.
- Use while loops instead of for loops when you don't need initializer and update expressions.
- Don't pass children as props.
- Don't reassign const variables.
- Don't use constant expressions in conditions.
- Don't use `Math.min` and `Math.max` to clamp values when the result is constant.
- Don't return a value from a constructor.
- Don't use empty character classes in regular expression literals.
- Don't use empty destructuring patterns.
- Don't call global object properties as functions.
- Don't declare functions and vars that are accessible outside their block.
- Make sure builtins are correctly instantiated.
- Don't use super() incorrectly inside classes. Also check that super() is called in classes that extend other constructors.
- Don't use variables and function parameters before they're declared.
- Don't use 8 and 9 escape sequences in string literals.
- Don't use literal numbers that lose precision.

#### React and JSX Best Practices

- Don't use the return value of React.render.
- Make sure all dependencies are correctly specified in React hooks.
- Make sure all React hooks are called from the top level of component functions.
- Don't forget key props in iterators and collection literals.
- Don't destructure props inside JSX components in Solid projects.
- Don't define React components inside other components.
- Don't use event handlers on non-interactive elements.
- Don't assign to React component props.
- Don't use both `children` and `dangerouslySetInnerHTML` props on the same element.
- Don't use dangerous JSX props.
- Don't use Array index in keys.
- Don't insert comments as text nodes.
- Don't assign JSX properties multiple times.
- Don't add extra closing tags for components without children.
- Use `<>...</>` instead of `<Fragment>...</Fragment>`.
- Watch out for possible "wrong" semicolons inside JSX elements.

#### Correctness and Safety

- Don't assign a value to itself.
- Don't return a value from a setter.
- Don't compare expressions that modify string case with non-compliant values.
- Don't use lexical declarations in switch clauses.
- Don't use variables that haven't been declared in the document.
- Don't write unreachable code.
- Make sure super() is called exactly once on every code path in a class constructor before this is accessed if the class has a superclass.
- Don't use control flow statements in finally blocks.
- Don't use optional chaining where undefined values aren't allowed.
- Don't have unused function parameters.
- Don't have unused imports.
- Don't have unused labels.
- Don't have unused private class members.
- Don't have unused variables.
- Make sure void (self-closing) elements don't have children.
- Don't return a value from a function with the return type 'void'
- Use isNaN() when checking for NaN.
- Make sure "for" loop update clauses move the counter in the right direction.
- Make sure typeof expressions are compared to valid values.
- Make sure generator functions contain yield.
- Don't use await inside loops.
- Don't use bitwise operators.
- Don't use expressions where the operation doesn't change the value.
- Make sure Promise-like statements are handled appropriately.
- Don't use **dirname and **filename in the global scope.
- Prevent import cycles.
- Don't use configured elements.
- Don't hardcode sensitive data like API keys and tokens.
- Don't let variable declarations shadow variables from outer scopes.
- Don't use the TypeScript directive @ts-ignore.
- Prevent duplicate polyfills from Polyfill.io.
- Don't use useless backreferences in regular expressions that always match empty strings.
- Don't use unnecessary escapes in string literals.
- Don't use useless undefined.
- Make sure getters and setters for the same property are next to each other in class and object definitions.
- Make sure object literals are declared consistently (defaults to explicit definitions).
- Use static Response methods instead of new Response() constructor when possible.
- Make sure switch-case statements are exhaustive.
- Make sure the `preconnect` attribute is used when using Google Fonts.
- Use `Array#{indexOf,lastIndexOf}()` instead of `Array#{findIndex,findLastIndex}()` when looking for the index of an item.
- Make sure iterable callbacks return consistent values.
- Use `with { type: "json" }` for JSON module imports.
- Use numeric separators in numeric literals.
- Use object spread instead of `Object.assign()` when constructing new objects.
- Always use the radix argument when using `parseInt()`.
- Make sure JSDoc comment lines start with a single asterisk, except for the first one.
- Include a description parameter for `Symbol()`.
- Don't use spread (`...`) syntax on accumulators.
- Don't use the `delete` operator.
- Don't access namespace imports dynamically.
- Don't use namespace imports.
- Declare regex literals at the top level.
- Don't use `target="_blank"` without `rel="noopener"`.

#### TypeScript Best Practices

- Don't use TypeScript enums.
- Don't export imported variables.
- Don't add type annotations to variables, parameters, and class properties that are initialized with literal expressions.
- Don't use TypeScript namespaces.
- Don't use non-null assertions with the `!` postfix operator.
- Don't use parameter properties in class constructors.
- Don't use user-defined types.
- Use `as const` instead of literal types and type annotations.
- Use either `T[]` or `Array<T>` consistently.
- Initialize each enum member value explicitly.
- Use `export type` for types.
- Use `import type` for types.
- Make sure all enum members are literal values.
- Don't use TypeScript const enum.
- Don't declare empty interfaces.
- Don't let variables evolve into any type through reassignments.
- Don't use the any type.
- Don't misuse the non-null assertion operator (!) in TypeScript files.
- Don't use implicit any type on variable declarations.
- Don't merge interfaces and classes unsafely.
- Don't use overload signatures that aren't next to each other.
- Use the namespace keyword instead of the module keyword to declare TypeScript namespaces.

#### Style and Consistency

- Don't use global `eval()`.
- Don't use callbacks in asynchronous tests and hooks.
- Don't use negation in `if` statements that have `else` clauses.
- Don't use nested ternary expressions.
- Don't reassign function parameters.
- This rule lets you specify global variable names you don't want to use in your application.
- Don't use specified modules when loaded by import or require.
- Don't use constants whose value is the upper-case version of their name.
- Use `String.slice()` instead of `String.substr()` and `String.substring()`.
- Don't use template literals if you don't need interpolation or special-character handling.
- Don't use `else` blocks when the `if` block breaks early.
- Don't use yoda expressions.
- Don't use Array constructors.
- Use `at()` instead of integer index access.
- Follow curly brace conventions.
- Use `else if` instead of nested `if` statements in `else` clauses.
- Use single `if` statements instead of nested `if` clauses.
- Use `new` for all builtins except `String`, `Number`, and `Boolean`.
- Use consistent accessibility modifiers on class properties and methods.
- Use `const` declarations for variables that are only assigned once.
- Put default function parameters and optional function parameters last.
- Include a `default` clause in switch statements.
- Use the `**` operator instead of `Math.pow`.
- Use `for-of` loops when you need the index to extract an item from the iterated array.
- Use `node:assert/strict` over `node:assert`.
- Use the `node:` protocol for Node.js builtin modules.
- Use Number properties instead of global ones.
- Use assignment operator shorthand where possible.
- Use function types instead of object types with call signatures.
- Use template literals over string concatenation.
- Use `new` when throwing an error.
- Don't throw non-Error values.
- Use `String.trimStart()` and `String.trimEnd()` over `String.trimLeft()` and `String.trimRight()`.
- Use standard constants instead of approximated literals.
- Don't assign values in expressions.
- Don't use async functions as Promise executors.
- Don't reassign exceptions in catch clauses.
- Don't reassign class members.
- Don't compare against -0.
- Don't use labeled statements that aren't loops.
- Don't use void type outside of generic or return types.
- Don't use console.
- Don't use control characters and escape sequences that match control characters in regular expression literals.
- Don't use debugger.
- Don't assign directly to document.cookie.
- Use `===` and `!==`.
- Don't use duplicate case labels.
- Don't use duplicate class members.
- Don't use duplicate conditions in if-else-if chains.
- Don't use two keys with the same name inside objects.
- Don't use duplicate function parameter names.
- Don't have duplicate hooks in describe blocks.
- Don't use empty block statements and static blocks.
- Don't let switch clauses fall through.
- Don't reassign function declarations.
- Don't allow assignments to native objects and read-only global variables.
- Use Number.isFinite instead of global isFinite.
- Use Number.isNaN instead of global isNaN.
- Don't assign to imported bindings.
- Don't use irregular whitespace characters.
- Don't use labels that share a name with a variable.
- Don't use characters made with multiple code points in character class syntax.
- Make sure to use new and constructor properly.
- Don't use shorthand assign when the variable appears on both sides.
- Don't use octal escape sequences in string literals.
- Don't use Object.prototype builtins directly.
- Don't redeclare variables, functions, classes, and types in the same scope.
- Don't have redundant "use strict".
- Don't compare things where both sides are exactly the same.
- Don't let identifiers shadow restricted names.
- Don't use sparse arrays (arrays with holes).
- Don't use template literal placeholder syntax in regular strings.
- Don't use the then property.
- Don't use unsafe negation.
- Don't use var.
- Don't use with statements in non-strict contexts.
- Make sure async functions actually use await.
- Make sure default clauses in switch statements come last.
- Make sure to pass a message value when creating a built-in error.
- Make sure get methods always return a value.
- Use a recommended display strategy with Google Fonts.
- Make sure for-in loops include an if statement.
- Use Array.isArray() instead of instanceof Array.
- Make sure to use the digits argument with Number#toFixed().
- Make sure to use the "use strict" directive in script files.

#### Next.js Specific Rules

- Don't use `<img>` elements in Next.js projects.
- Don't use `<head>` elements in Next.js projects.
- Don't import next/document outside of pages/\_document.jsx in Next.js projects.
- Don't use the next/head module in pages/\_document.js on Next.js projects.

#### Testing Best Practices

- Don't use export or module.exports in test files.
- Don't use focused tests.
- Make sure the assertion function, like expect, is placed inside an it() function call.
- Don't use disabled tests.
