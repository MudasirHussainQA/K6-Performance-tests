# Contributing to K6 Contact List Test Suite

Thank you for your interest in contributing to this project! This guide will help you get started.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature
4. Make your changes
5. Test your changes
6. Submit a pull request

## 📝 Code Style Guidelines

### JavaScript Style

- Use ES6+ features
- Use descriptive variable names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await for asynchronous operations

### Test Structure

```javascript
import { group, sleep } from 'k6';
import { API } from '../utils/api.js';
import { helpers } from '../utils/helpers.js';

export const options = {
  // Test configuration
};

export default function () {
  group('Test Group Name', () => {
    // Test implementation
    // Use helpers for common operations
    // Add appropriate assertions
    sleep(1);
  });
}

export function setup() {
  console.log('Test setup');
}

export function teardown(data) {
  console.log('Test cleanup');
}
```

## 🧪 Adding New Tests

### 1. Create Test File

Create a new file in `tests/scenarios/`:

```javascript
// tests/scenarios/my-new-test.js
import { group, sleep } from 'k6';
import { config } from '../../config/config.js';
import { MyAPI } from '../../utils/api.js';
import {
  checkResponse,
  parseJsonResponse,
  logTest,
  logSuccess,
} from '../../utils/helpers.js';

export const options = {
  scenarios: {
    my_test: config.scenarios.smoke,
  },
  thresholds: config.thresholds,
};

export default function () {
  group('My Test Group', () => {
    logTest('Testing new feature');
    
    const response = MyAPI.someEndpoint();
    
    if (checkResponse(response, 'My Test', 200)) {
      logSuccess('Test passed!');
    }
    
    sleep(1);
  });
}

export function setup() {
  console.log('🚀 Starting My New Test...');
  return {};
}

export function teardown(data) {
  console.log('✅ My New Test Completed!');
}
```

### 2. Add API Wrapper (if needed)

Update `utils/api.js`:

```javascript
export const MyAPI = {
  someEndpoint(token, data) {
    const url = `${BASE_URL}/my-endpoint`;
    const payload = JSON.stringify(data);
    return http.post(url, payload, { headers: getAuthHeaders(token) });
  },
};
```

### 3. Add Helper Function (if needed)

Update `utils/helpers.js`:

```javascript
export function myNewHelper() {
  // Implementation
}
```

### 4. Add NPM Script

Update `package.json`:

```json
{
  "scripts": {
    "test:my-new-test": "k6 run tests/scenarios/my-new-test.js"
  }
}
```

## 🎯 Test Best Practices

### 1. Use Descriptive Names

```javascript
// ❌ Bad
group('Test 1', () => { ... });

// ✅ Good
group('User Registration with Valid Data', () => { ... });
```

### 2. Add Proper Checks

```javascript
// ❌ Bad
const response = API.endpoint();

// ✅ Good
const response = API.endpoint();
checkResponse(response, 'Descriptive Test Name', 200);
```

### 3. Clean Up Resources

```javascript
export default function () {
  const token = authenticate();
  const resourceId = createResource(token);
  
  // ... test logic ...
  
  // Clean up
  deleteResource(token, resourceId);
}
```

### 4. Use Appropriate Sleep Durations

```javascript
// Short operations
sleep(0.5);

// Normal operations
sleep(1);

// Long operations
sleep(2);

// Between test iterations
randomSleep(1, 3);
```

### 5. Handle Errors Gracefully

```javascript
const response = API.endpoint();

if (response.status !== 200) {
  logError(`Failed: ${response.status} - ${response.body}`);
  return; // Exit gracefully
}
```

## 🔍 Testing Your Changes

### Run Smoke Test

```bash
npm run test:smoke
```

### Run Your New Test

```bash
k6 run tests/scenarios/my-new-test.js
```

### Verify All Tests Still Work

```bash
npm test
npm run test:auth
npm run test:contacts
```

## 📊 Performance Considerations

### Thresholds

When adding new endpoints, consider appropriate thresholds:

```javascript
thresholds: {
  'http_req_duration{endpoint:my_endpoint}': ['p(95)<500'],
  'http_req_failed{endpoint:my_endpoint}': ['rate<0.05'],
}
```

### Load Patterns

Consider realistic load patterns for your tests:

```javascript
scenarios: {
  realistic_load: {
    executor: 'ramping-arrival-rate',
    startRate: 1,
    timeUnit: '1s',
    preAllocatedVUs: 10,
    stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 10 },
      { duration: '30s', target: 0 },
    ],
  },
}
```

## 📚 Documentation

### Update README

If adding new features, update README.md:

- Add to test scenarios section
- Update project structure
- Add usage examples
- Update configuration options

### Add Inline Comments

```javascript
/**
 * Test user registration with various data scenarios
 * 
 * This test validates:
 * - Successful registration with valid data
 * - Error handling for invalid data
 * - Token generation and validation
 */
export default function () {
  // Test implementation
}
```

## 🐛 Bug Reports

When reporting bugs, include:

1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. K6 version
6. Operating system
7. Relevant logs

## 💡 Feature Requests

When suggesting features:

1. Describe the feature
2. Explain the use case
3. Provide examples
4. Discuss potential impact

## ✅ Pull Request Checklist

Before submitting a PR:

- [ ] Tests run successfully
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Commits are descriptive
- [ ] Branch is up to date with main

## 🤝 Code Review Process

1. Submit PR with clear description
2. Address reviewer feedback
3. Ensure CI/CD passes
4. Wait for approval
5. Squash and merge

## 📞 Getting Help

- Open an issue
- Ask in discussions
- Check existing documentation
- Review K6 docs: https://k6.io/docs/

## 🎉 Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!

