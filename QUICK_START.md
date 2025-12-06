# Quick Start Guide

## For Reviewers

```bash
# 1. Clone repository
git clone https://github.com/azrim/fhevm-examples-generator.git
cd fhevm-examples-generator

# 2. Install dependencies (automatically clones base-template)
npm ci

# 3. Validate code quality
npm run validate

# 4. Run tests
npm test
# Expected: 6/6 tests passing

# 5. Scaffold all examples
npm run scaffold:all
# Expected: 5 examples created, 45 tests passing

# 6. Test an example
cd scaffolded/basic-counter
npm ci
npm test
```

## For Submission

See `FINAL_SUBMISSION_GUIDE.md` for complete submission instructions.

**TL;DR:**
1. Validate: `npm run validate`
2. Push to GitHub: `git push origin master`
3. Submit on Zama Guild with repository URL
4. Done!

## Documentation Structure

- **README.md** - Main usage guide and features
- **SUBMISSION.md** - Comprehensive bounty submission document
- **FINAL_SUBMISSION_GUIDE.md** - Quick submission instructions
- **BASE_TEMPLATE_NOTE.md** - About the base template
- **QUICK_START.md** - This file

## What's Included

✅ 5 working examples
✅ 45 passing tests
✅ Complete automation (CLI, doc generator, driver)
✅ CI/CD workflow
✅ Comprehensive documentation
