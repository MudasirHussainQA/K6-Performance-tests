# K6 Quick Reference Guide

## 🚀 Quick Commands

### Run Tests & Generate Reports

```bash
# Test with automatic report generation
npm run test:report

# Or run separately
npm test
npm run report
```

### Environment-Specific Tests

```bash
# Production
npm run test:prod

# QA
npm run test:qa

# Staging  
npm run test:staging
```

### Test Types

```bash
# Smoke Test (1 min, 1 user)
npm run test:smoke

# Load Test (9 min, up to 20 users)
npm run test:load

# Stress Test (14 min, up to 50 users)
npm run test:stress

# Spike Test (8 min, traffic surge)
npm run test:spike
```

### Specific Scenarios

```bash
# Auth tests only
npm run test:auth

# Contact tests only
npm run test:contacts
```

## 📊 Reports

### View Reports

Reports are auto-generated in `reports/`:
- **HTML Report**: `reports/report.html` (opens automatically)
- **JSON Data**: `reports/smoke-results.json`, `reports/load-results.json`, etc.

### Open Report Manually

```bash
# macOS
open reports/report.html

# Linux
xdg-open reports/report.html

# Windows
start reports/report.html
```

## 🌍 Environments

| Command | Environment | URL |
|---------|-------------|-----|
| `npm run test:prod` | Production | thinking-tester-contact-list.herokuapp.com |
| `npm run test:staging` | Staging | staging-contact-list.herokuapp.com |
| `npm run test:qa` | QA | qa-contact-list.herokuapp.com |

### Custom URL

```bash
npm run build && k6 run dist/main.js --env BASE_URL=https://custom-url.com
```

## 🛠️ Development

```bash
# Build TypeScript
npm run build

# Watch mode (auto-rebuild)
npm run watch

# Type checking
npm run type-check

# Linting
npm run lint

# Clean
npm run clean
```

## 📈 Understanding Reports

### Key Metrics

- **Checks Passed**: Should be > 95%
- **Success Rate**: Should be > 95%
- **Avg Response**: Lower is better (< 300ms excellent)
- **P95**: 95% of requests faster than this
- **P99**: 99% of requests faster than this

### Status Badges

- 🟢 **Green**: Excellent performance
- 🟡 **Yellow**: Good but could be improved  
- 🔴 **Red**: Needs attention

## ⚡ Common Workflows

### Daily Testing

```bash
# Quick smoke test
npm run test:smoke && npm run report
```

### Before Deployment

```bash
# 1. Test QA
npm run test:qa

# 2. If passes, test staging
npm run test:staging

# 3. Generate report
npm run report
```

### Performance Analysis

```bash
# 1. Run load test
npm run test:load

# 2. View report
npm run report

# Report opens automatically in browser
```

### Environment Testing

```bash
# Test all environments
npm run test:qa && npm run report
npm run test:staging && npm run report
npm run test:prod && npm run report
```

## 📁 File Locations

```
reports/
├── report.html              ← Latest HTML report
├── smoke-results.json       ← Smoke test data
├── load-results.json        ← Load test data
├── stress-results.json      ← Stress test data
├── prod-results.json        ← Production test data
├── qa-results.json          ← QA test data
└── staging-results.json     ← Staging test data
```

## 🎯 Thresholds by Environment

### Production (Strict)
- P95 < 500ms
- P99 < 1000ms
- Error rate < 1%

### Staging (Moderate)
- P95 < 800ms
- P99 < 1500ms
- Error rate < 5%

### QA (Relaxed)
- P95 < 1000ms
- P99 < 2000ms  
- Error rate < 10%

## 🐛 Troubleshooting

### Report not generating?
```bash
# Check if JSON exists
ls reports/*.json

# Manually generate
npm run report
```

### Tests failing?
```bash
# Check environment
k6 run dist/main.js --env ENVIRONMENT=qa

# View detailed logs
npm run test:smoke 2>&1 | tee test-output.log
```

### Build errors?
```bash
# Clean and rebuild
npm run clean
npm run build
```

## 💡 Pro Tips

1. **Always generate reports**: `npm run test:report`
2. **Test environments in order**: dev → qa → staging → prod
3. **Check reports in browser**: Beautiful visual analysis
4. **Use smoke tests**: Quick validation (1 min)
5. **Save reports**: Archive before major changes

## 📚 More Info

- Full docs: [README.md](README.md)
- Environments: [ENVIRONMENTS.md](ENVIRONMENTS.md)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- API Reference: [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md)

---

**Happy Testing! 🚀**

