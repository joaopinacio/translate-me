# GitHub Actions Workflows

This project has two configured workflows to ensure code quality:

## 🚀 CI Workflow (`ci.yml`)
**Recommended for general use**

### When it runs:
- ✅ Pull Requests to `main`
- ✅ Direct push to `main`

### What it does:
1. **Main test** (Node.js 20):
   - Installs dependencies
   - Runs linting (ESLint)
   - Compiles TypeScript
   - Runs all unit tests

2. **Matrix test** (PRs only):
   - Tests on Node.js 18, 20, and 22
   - Ensures compatibility across versions

### Status:
- ✅ Fast (~2-3 minutes)
- ✅ Simple and straightforward
- ✅ Focuses on essentials

---

## 🔬 Test Suite Workflow (`test.yml`)
**For detailed analysis**

### When it runs:
- ✅ Pull Requests to `main`
- ✅ Direct push to `main`

### What it does:
1. Tests on Node.js 18 and 20
2. Runs complete linting
3. Compiles TypeScript
4. Runs unit tests
5. **Generates coverage report**
6. Uploads to Codecov
7. Comments on PR with results

### Status:
- 🔍 More detailed
- 📊 Includes code coverage
- 💬 Automatic PR comments

---

## 🛠️ How to use

### For normal development:
Use the **CI Workflow** - it's faster and covers all essential cases.

### For important releases:
Use the **Test Suite Workflow** when you want complete coverage analysis.

### Disable a workflow:
If you want to use only one, rename the unwanted file from `.yml` to `.yml.disabled`.

---

## 📋 Local commands

Before committing, test locally:

```bash
# Linting
npm run lint

# Compilation
npm run compile

# Tests
npm run test:unit

# Tests with coverage
npm run test:unit:coverage
```

---

## 🔧 Configuration

The workflows are configured to fail if:
- ❌ Linting finds errors
- ❌ TypeScript compilation fails
- ❌ Any test fails

This ensures that only quality code is merged into `main`. 