# Environment Configuration Guide

## 🌍 Available Environments

This project supports multiple environments with different configurations and thresholds.

### Environments

| Environment | Purpose | Base URL | Error Threshold |
|-------------|---------|----------|-----------------|
| **Production** | Live system | `thinking-tester-contact-list.herokuapp.com` | 1% |
| **Staging** | Pre-production | `staging-contact-list.herokuapp.com` | 5% |
| **QA** | Quality assurance | `qa-contact-list.herokuapp.com` | 10% |
| **Development** | Local development | `localhost:3000` | 20% |

## 🚀 Running Tests by Environment

### Production
```bash
npm run test:prod
# or
npm run build && k6 run dist/main.js --env ENVIRONMENT=production
```

### Staging
```bash
npm run test:staging
# or
npm run build && k6 run dist/main.js --env ENVIRONMENT=staging
```

### QA
```bash
npm run test:qa
# or
npm run build && k6 run dist/main.js --env ENVIRONMENT=qa
```

### Development
```bash
npm run build && k6 run dist/main.js --env ENVIRONMENT=development
```

## ⚙️ Environment Configuration

Each environment has its own configuration file:

- `.env.production` - Production settings
- `.env.staging` - Staging settings
- `.env.qa` - QA settings
- `.env.development` - Development settings

### Configuration Structure

```env
ENVIRONMENT=production
BASE_URL=https://your-api-url.com
LOG_LEVEL=error
```

## 🎯 Performance Thresholds by Environment

### Production (Strict)
- **Response Time P95**: < 500ms
- **Response Time P99**: < 1000ms
- **Error Rate**: < 1%
- **Request Rate**: > 20 req/s

### Staging (Moderate)
- **Response Time P95**: < 800ms
- **Response Time P99**: < 1500ms
- **Error Rate**: < 5%
- **Request Rate**: > 10 req/s

### QA (Relaxed)
- **Response Time P95**: < 1000ms
- **Response Time P99**: < 2000ms
- **Error Rate**: < 10%
- **Request Rate**: > 5 req/s

### Development (Minimal)
- **Response Time P95**: < 2000ms
- **Response Time P99**: < 5000ms
- **Error Rate**: < 20%
- **Request Rate**: > 1 req/s

## 🔧 Custom Environment

### Using Custom URL

Override the base URL with environment variable:

```bash
npm run build && k6 run dist/main.js --env BASE_URL=https://custom-url.com --env ENVIRONMENT=qa
```

### Create Custom Environment

1. Add to `src/config/environments.ts`:

```typescript
custom: {
  name: 'Custom',
  baseUrl: __ENV.BASE_URL || 'https://custom-url.com',
  timeout: '30s',
  thresholds: {
    responseTime95: 600,
    responseTime99: 1200,
    errorRate: 0.03,
    requestRate: 15,
  },
}
```

2. Create `.env.custom`:

```env
ENVIRONMENT=custom
BASE_URL=https://custom-url.com
LOG_LEVEL=info
```

3. Run tests:

```bash
k6 run dist/main.js --env ENVIRONMENT=custom
```

## 📊 Environment-Specific Reports

Each environment generates its own report:

```bash
# Production report
npm run test:prod && npm run report

# QA report
npm run test:qa && npm run report

# Staging report
npm run test:staging && npm run report
```

Reports are saved in `reports/`:
- `prod-results.json` - Production results
- `qa-results.json` - QA results
- `staging-results.json` - Staging results
- `report.html` - Latest HTML report

## 🎨 Visual Output

When tests run, you'll see environment info:

```
🌍 Environment: Production
📍 Base URL: https://thinking-tester-contact-list.herokuapp.com
⏱️  Timeout: 30s
🎯 Thresholds:
   - P95: < 500ms
   - P99: < 1000ms
   - Error Rate: < 1%
```

## 💡 Best Practices

### 1. Development → QA → Staging → Production

Always test in order of increasing strictness:

```bash
# 1. Test locally first
npm run build && k6 run dist/main.js --env ENVIRONMENT=development

# 2. Then QA
npm run test:qa

# 3. Then Staging
npm run test:staging

# 4. Finally Production
npm run test:prod
```

### 2. Use Appropriate Test Types per Environment

| Test Type | Development | QA | Staging | Production |
|-----------|-------------|-----|---------|------------|
| Smoke | ✅ | ✅ | ✅ | ✅ |
| Load | ⚠️ | ✅ | ✅ | ⚠️ |
| Stress | ❌ | ✅ | ✅ | ❌ |
| Spike | ❌ | ⚠️ | ✅ | ❌ |

### 3. Environment-Specific Test Schedules

**Production:**
- Smoke tests: Every deployment
- Load tests: Weekly (off-peak hours)
- Monitor: 24/7

**Staging:**
- All test types: Before each deployment
- Load tests: Daily
- Stress tests: Before major releases

**QA:**
- All test types: Continuously
- Experiments: Anytime

**Development:**
- Smoke tests: During development
- Quick validations: As needed

## 🔒 Security Notes

1. **Never commit** actual API keys or tokens in `.env` files
2. Use environment variables for sensitive data
3. Production credentials should be in CI/CD secrets
4. Different API keys per environment

## 📝 Example Workflow

```bash
# 1. Build the project
npm run build

# 2. Run smoke test on QA
k6 run dist/main.js --env ENVIRONMENT=qa --env TEST_TYPE=smoke

# 3. If passes, run load test
k6 run dist/load-test.js --env ENVIRONMENT=qa

# 4. Generate report
npm run report

# 5. If all good, test staging
npm run test:staging

# 6. Final production smoke test
npm run test:prod
```

## 🎯 CI/CD Integration

### GitHub Actions Example

```yaml
jobs:
  test-qa:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:qa
      
  test-staging:
    needs: test-qa
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:staging
      
  test-production:
    needs: test-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npm run test:prod
```

---

**Need help?** Check the main [README.md](README.md) for more details.

