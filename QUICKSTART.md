# Quick Start Guide (TypeScript)

Get up and running with K6 Contact List API tests in TypeScript in under 5 minutes! 🚀

## Prerequisites

- **K6 installed** (see installation below)
- **Node.js** (v14 or higher)
- **Terminal/Command Line** access

## Step 1: Install K6 ⚙️

### macOS
```bash
brew install k6
```

### Windows (using Chocolatey)
```bash
choco install k6
```

### Linux (Debian/Ubuntu)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Verify Installation
```bash
k6 version
node --version  # Should be v14 or higher
```

## Step 2: Install Dependencies 📦

```bash
cd "/Users/mudasirhussain/Desktop/K6 ContactList"
npm install
```

This will install:
- TypeScript
- Webpack and Babel
- K6 type definitions
- ESLint and other dev tools

## Step 3: Build the Project 🏗️

```bash
npm run build
```

This compiles TypeScript files from `src/` to JavaScript in `dist/`.

## Step 4: Run Your First Test 🧪

```bash
npm test
```

This will:
1. Build the TypeScript code
2. Run a 1-minute smoke test
3. Show you results in the console

## What to Expect 👀

You'll see output like this:

```
╔════════════════════════════════════════════════════════════╗
║       K6 Contact List API - Performance Test Suite         ║
╚════════════════════════════════════════════════════════════╝

🚀 Test Type: SMOKE
📍 Base URL: https://thinking-tester-contact-list.herokuapp.com
⏱️  Starting tests at: 2025-10-23T...

running (01m00.0s), 0/1 VUs, 50 complete and 0 interrupted iterations
default ✓ [======================================] 1 VUs  1m0s

✓ checks.........................: 100.00% ✓ 450 ✗ 0
http_req_duration..............: avg=231ms p(95)=312ms p(99)=401ms
http_reqs......................: 900     15/s

✅ All Tests Completed!
```

## Next Steps 🎯

### 1. Development Workflow

#### Watch Mode (Auto-rebuild)
```bash
npm run watch
```
Leave this running in one terminal, and your code will auto-rebuild on changes.

#### Run Tests in Another Terminal
```bash
k6 run dist/main.js
```

### 2. Run Different Test Types

**Load Test (10 VUs, ~9 minutes):**
```bash
npm run test:load
```

**Stress Test (up to 50 VUs, ~14 minutes):**
```bash
npm run test:stress
```

**Spike Test:**
```bash
npm run test:spike
```

### 3. Run Specific Scenarios

**Authentication Tests:**
```bash
npm run test:auth
```

**Contact Tests:**
```bash
npm run test:contacts
```

**Build once, run multiple times:**
```bash
npm run build
k6 run dist/auth.test.js
k6 run dist/contacts.test.js
k6 run dist/negative-auth.test.js
```

### 4. Type Checking and Linting

**Check types without building:**
```bash
npm run type-check
```

**Run linter:**
```bash
npm run lint
```

## TypeScript Development Tips 💡

### 1. Use IntelliSense

Open any `.ts` file in VS Code or your IDE:
- Hover over functions for documentation
- Get auto-completion
- See type hints

### 2. Type-Safe API Calls

```typescript
import { UserAPI } from '../utils/api';
import { generateRandomUser } from '../utils/helpers';
import { AuthResponse } from '../types';

const userData = generateRandomUser();
const response = UserAPI.register(userData);
const data = parseJsonResponse<AuthResponse>(response);

if (data) {
  const token: string = data.token; // ✅ Type-safe!
}
```

### 3. Custom Types

Add new types in `src/types/index.ts`:
```typescript
export interface MyCustomType {
  field1: string;
  field2: number;
}
```

## Common Commands 📋

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Build TypeScript → JavaScript |
| `npm run build:dev` | Development build |
| `npm run watch` | Auto-rebuild on changes |
| `npm run type-check` | Check types only |
| `npm run lint` | Run ESLint |
| `npm test` | Build & run smoke test |
| `npm run test:load` | Build & run load test |
| `npm run test:stress` | Build & run stress test |

## Project Structure 📁

```
src/                          ← Your TypeScript code
├── types/index.ts           ← Type definitions
├── config/config.ts         ← Configuration
├── utils/
│   ├── api.ts              ← API wrappers
│   └── helpers.ts          ← Utility functions
└── tests/
    ├── main.ts             ← Main test
    ├── load-test.ts        ← Load test
    ├── stress-test.ts      ← Stress test
    └── scenarios/          ← Test scenarios
        ├── auth.test.ts
        ├── contacts.test.ts
        └── ...

dist/                         ← Compiled JavaScript (auto-generated)
├── main.js
├── load-test.js
└── ...
```

## Troubleshooting 🔧

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: Build errors
**Solution:** 
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Type errors
**Solution:** Run `npm run type-check` to see detailed errors

### Issue: K6 can't find dist/main.js
**Solution:** Build first: `npm run build`

### Issue: Tests failing
**Solution:** 
- Check API is accessible: `curl https://thinking-tester-contact-list.herokuapp.com`
- Verify build is up to date: `npm run build`

## VS Code Setup 🎨

### Recommended Extensions

1. **ESLint** - `dbaeumer.vscode-eslint`
2. **TypeScript** - Built-in
3. **Prettier** - `esbenp.prettier-vscode`

### Settings

Add to `.vscode/settings.json`:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Quick Reference 📝

### Build & Test
```bash
# One-liner: build and test
npm test

# Or separate steps
npm run build
k6 run dist/main.js

# Watch mode (terminal 1)
npm run watch

# Run tests (terminal 2)
k6 run dist/main.js
```

### Development
```bash
# Check types
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Build for development (faster)
npm run build:dev
```

## What's Different from JavaScript? 🤔

### JavaScript (Old)
```javascript
// No type safety
const userData = generateRandomUser();
const response = UserAPI.register(userData);
const data = JSON.parse(response.body);
const token = data.token; // Could be undefined!
```

### TypeScript (New)
```typescript
// Type-safe!
const userData: User = generateRandomUser();
const response: K6Response = UserAPI.register(userData);
const data: AuthResponse | null = parseJsonResponse<AuthResponse>(response);
const token: string | null = data?.token ?? null; // Explicit null handling
```

## Benefits ✨

✅ **Auto-completion** - Your IDE knows what methods exist  
✅ **Type checking** - Catch errors before running tests  
✅ **Refactoring** - Rename with confidence  
✅ **Documentation** - Types serve as inline docs  
✅ **Scalability** - Easy to maintain as project grows  

## Ready to Start? 🚀

```bash
cd "/Users/mudasirhussain/Desktop/K6 ContactList"
npm install
npm run build
npm test
```

**Happy Testing with TypeScript! 🎉**

For more details, check the [README.md](README.md).
