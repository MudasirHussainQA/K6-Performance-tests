# K6 Contact List API - Automation Test Suite (TypeScript)

A comprehensive K6 performance testing suite for the Contact List API, written in **TypeScript** with full type safety and modern tooling.

## 📚 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Building the Project](#building-the-project)
- [Test Scenarios](#test-scenarios)
- [Configuration](#configuration)
- [TypeScript Benefits](#typescript-benefits)
- [CI/CD Integration](#cicd-integration)
- [API Documentation](#api-documentation)

## ✨ Features

- **TypeScript**: Full type safety and IntelliSense support
- **Complete API Coverage**: Tests for all authentication and contact management endpoints
- **Multiple Test Types**: Smoke, Load, Stress, and Spike testing scenarios
- **Positive & Negative Testing**: Comprehensive validation including error scenarios
- **Realistic Load Patterns**: Simulates actual user behavior
- **Custom Metrics**: Detailed performance metrics and KPIs
- **Easy Configuration**: Environment-based configuration management
- **Reusable Components**: Modular design with utility functions and API wrappers
- **Beautiful Console Output**: Color-coded logs and formatted reports
- **Webpack Build System**: Efficient bundling and compilation

## 🔧 Prerequisites

Before running the tests, ensure you have the following installed:

1. **K6** - Load testing tool
   ```bash
   # macOS (using Homebrew)
   brew install k6

   # Windows (using Chocolatey)
   choco install k6

   # Linux (Debian/Ubuntu)
   sudo gpg -k
   sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
   echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt-get update
   sudo apt-get install k6
   ```

2. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/

## 📥 Installation

1. Navigate to the project directory:
   ```bash
   cd "K6 ContactList"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration (if needed):
   ```env
   BASE_URL=https://thinking-tester-contact-list.herokuapp.com
   TEST_TYPE=smoke
   ```

## 📁 Project Structure

```
K6 ContactList/
├── 📄 Configuration Files
│   ├── package.json              # NPM dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── webpack.config.js         # Webpack build configuration
│   ├── .babelrc                  # Babel configuration
│   ├── .eslintrc.json            # ESLint configuration
│   ├── .env.example              # Environment variables template
│   └── .gitignore                # Git ignore rules
│
├── 📂 src/                       # TypeScript source files
│   ├── 📂 types/
│   │   └── index.ts              # TypeScript type definitions
│   │
│   ├── 📂 config/
│   │   └── config.ts             # Test configuration & scenarios
│   │
│   ├── 📂 utils/
│   │   ├── api.ts                # API endpoint wrappers
│   │   └── helpers.ts            # Utility functions & helpers
│   │
│   └── 📂 tests/
│       ├── main.ts               # Main test orchestrator
│       ├── load-test.ts          # Load testing script
│       ├── stress-test.ts        # Stress testing script
│       └── 📂 scenarios/
│           ├── auth.test.ts              # Authentication tests
│           ├── negative-auth.test.ts     # Negative auth tests
│           ├── contacts.test.ts          # Contact management tests
│           └── negative-contacts.test.ts # Negative contact tests
│
├── 📂 dist/                      # Compiled JavaScript output (generated)
│   ├── main.js
│   ├── load-test.js
│   ├── stress-test.js
│   └── ...
│
├── 📂 docs/
│   └── API_ENDPOINTS.md          # Complete API documentation
│
└── 📂 .github/
    └── workflows/
        └── k6-tests.yml          # GitHub Actions CI/CD workflow
```

## 🏗️ Building the Project

Before running tests, you need to compile TypeScript to JavaScript:

### Build Commands

```bash
# Production build (optimized)
npm run build

# Development build
npm run build:dev

# Watch mode (auto-rebuild on changes)
npm run watch

# Type checking only (no build)
npm run type-check

# Linting
npm run lint
```

## 🚀 Running Tests

### Quick Start

**Note**: Tests will automatically build before running when using npm scripts.

```bash
# Run main test suite (builds automatically)
npm test

# Or build first and run with K6 directly
npm run build
k6 run dist/main.js
```

### Test Types

#### 1. Smoke Test (Quick validation)
```bash
npm run test:smoke
# or
npm run build && k6 run dist/main.js --env TEST_TYPE=smoke
```
- **Duration**: ~1 minute
- **VUs**: 1 virtual user
- **Purpose**: Quick sanity check

#### 2. Load Test (Average load)
```bash
npm run test:load
# or
npm run build && k6 run dist/load-test.js
```
- **Duration**: ~9 minutes
- **VUs**: Ramps up to 20
- **Purpose**: Test under normal load conditions

#### 3. Stress Test (Breaking point)
```bash
npm run test:stress
# or
npm run build && k6 run dist/stress-test.js
```
- **Duration**: ~14 minutes
- **VUs**: Ramps up to 50
- **Purpose**: Find system limits

#### 4. Spike Test (Sudden traffic surge)
```bash
npm run test:spike
# or
npm run build && k6 run dist/main.js --env TEST_TYPE=spike
```
- **Duration**: ~8 minutes
- **VUs**: Sudden spike to 50
- **Purpose**: Test recovery from traffic spikes

### Specific Test Scenarios

#### Authentication Tests Only
```bash
npm run test:auth
# or
npm run build && k6 run dist/auth.test.js
```

#### Contact Management Tests Only
```bash
npm run test:contacts
# or
npm run build && k6 run dist/contacts.test.js
```

#### Negative Tests
```bash
npm run build
k6 run dist/negative-auth.test.js
k6 run dist/negative-contacts.test.js
```

### Custom Configuration

Run with custom URL:
```bash
npm run build
k6 run dist/main.js --env BASE_URL=https://your-api-url.com
```

Run with custom VUs and duration:
```bash
npm run build
k6 run --vus 10 --duration 30s dist/main.js
```

## 🎯 Test Scenarios

### Main Test Flow (`src/tests/main.ts`)

1. **User Registration and Authentication**
   - Register new user
   - Login with credentials

2. **User Profile Management**
   - Get user profile
   - Update user profile

3. **Contact Creation**
   - Create multiple contacts

4. **Contact Retrieval**
   - Get all contacts
   - Get individual contacts by ID

5. **Contact Updates**
   - Full update (PUT)
   - Partial update (PATCH)

6. **Contact Deletion**
   - Delete all created contacts

7. **Verification After Deletion**
   - Verify contacts were deleted

8. **Cleanup and Logout**
   - Logout user

## ⚙️ Configuration

### Environment Variables (`.env`)
```env
BASE_URL=https://thinking-tester-contact-list.herokuapp.com
TEST_TYPE=smoke
LOG_LEVEL=info
```

### Test Scenarios Configuration

Located in `src/config/config.ts`:
```typescript
scenarios: {
  smoke: {
    executor: 'constant-vus',
    vus: 1,
    duration: '1m',
  },
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 10 },
      { duration: '5m', target: 10 },
      { duration: '2m', target: 0 },
    ],
  },
  // ... more scenarios
}
```

## 💡 TypeScript Benefits

### Type Safety
```typescript
// Strongly typed API responses
const response = UserAPI.register(userData);
const data = parseJsonResponse<AuthResponse>(response);
if (data) {
  const token: string = data.token; // Type-safe!
  const userId: string = data.user._id;
}
```

### IntelliSense Support
- Auto-completion for all API methods
- Type hints for function parameters
- Inline documentation

### Early Error Detection
- Catch type errors at compile-time
- No runtime type surprises
- Refactoring with confidence

### Better Code Organization
```typescript
// Clear interfaces
interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  // ... more fields
}

// Type-safe API calls
ContactAPI.add(token: string, contact: Contact): K6Response
```

## 📊 Performance Thresholds

Default performance thresholds are defined in `src/config/config.ts`:

```typescript
thresholds: {
  http_req_duration: ['p(95)<500', 'p(99)<1000'],  // Response time
  http_req_failed: ['rate<0.05'],                   // Error rate < 5%
  http_reqs: ['rate>10'],                           // Min 10 req/s
}
```

## 🔄 CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/k6-tests.yml`) that:
- Runs on push to main/develop
- Runs on pull requests
- Scheduled daily at 2 AM UTC
- Manual workflow dispatch with test type selection
- Automatically builds TypeScript before running tests

```yaml
- name: Install Dependencies
  run: npm install

- name: Build TypeScript
  run: npm run build

- name: Run Tests
  run: k6 run dist/main.js
```

## 📖 API Documentation

The Contact List API documentation is available at:
https://documenter.getpostman.com/view/4012288/TzK2bEa8

### Base URL
```
https://thinking-tester-contact-list.herokuapp.com
```

For detailed endpoint information, see [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md)

## 🎓 Development

### Adding New Tests

1. Create a new TypeScript file in `src/tests/scenarios/`
2. Define your types in `src/types/index.ts`
3. Use the API wrappers from `src/utils/api.ts`
4. Use helper functions from `src/utils/helpers.ts`
5. Add entry point to `webpack.config.js`
6. Build and run

Example:
```typescript
import { group, sleep } from 'k6';
import { Options } from 'k6/options';
import { UserAPI } from '../../utils/api';
import { generateRandomUser, checkResponse } from '../../utils/helpers';

export const options: Options = {
  scenarios: {
    my_test: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
  },
};

export default function (): void {
  const userData = generateRandomUser();
  const response = UserAPI.register(userData);
  checkResponse(response, 'My Test', 201);
  sleep(1);
}
```

### Project Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run watch` | Watch and auto-rebuild |
| `npm run type-check` | Type check without building |
| `npm run lint` | Run ESLint |
| `npm test` | Build and run main tests |
| `npm run test:smoke` | Build and run smoke tests |
| `npm run test:load` | Build and run load tests |
| `npm run test:stress` | Build and run stress tests |

## 🐛 Troubleshooting

### Common Issues

**Issue: Build errors**
- Solution: Run `npm install` to ensure all dependencies are installed
- Check TypeScript version: `npx tsc --version`

**Issue: Type errors**
- Solution: Run `npm run type-check` to see detailed type errors
- Ensure `@types/k6` is installed

**Issue: Tests failing with 401 errors**
- Solution: Check if the API URL is correct in `.env` or `src/config/config.ts`

**Issue: Webpack build fails**
- Solution: Delete `node_modules` and `dist` folders, then run `npm install && npm run build`

## 📝 Contributing

To contribute to this project:

1. Write TypeScript code in the `src/` directory
2. Follow the existing code style
3. Run `npm run lint` to check for issues
4. Run `npm run type-check` to verify types
5. Build and test your changes
6. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

MIT License - feel free to use and modify as needed.

## 🤝 Support

For issues or questions:
- Open an issue in the repository
- Check K6 documentation: https://k6.io/docs/
- Check TypeScript documentation: https://www.typescriptlang.org/docs/
- Contact List API docs: https://documenter.getpostman.com/view/4012288/TzK2bEa8

## 🎉 Happy Testing!

TypeScript + K6 = Type-safe, reliable performance testing! 🚀

---

**Created with ❤️ for reliable API testing**
**Powered by TypeScript, K6, and Webpack**
