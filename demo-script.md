# FHEVM Examples Generator - Demo Script

**Duration:** 2-4 minutes
**Purpose:** Demonstrate the FHEVM Examples Generator tooling

---

## Introduction (15 seconds)

"Hi! I'm demonstrating the FHEVM Examples Generator - a production-ready tool that scaffolds standalone Hardhat FHEVM example repositories from the official Zama template."

## Setup (20 seconds)

"First, let's verify our environment and install dependencies."

```bash
node --version
npm --version
git --version
npm ci
```

"The base template is already cloned and ready to use."

## Scaffold Single Example (45 seconds)

"Let's scaffold a basic counter example using the CLI."

```bash
npm run cli basic-counter -- \
  --contractTemplate templates/contracts/basic-counter.sol \
  --testTemplate templates/tests/basic-counter.test.ts
```

"The CLI:
- Clones the base template with full history
- Creates a dedicated branch
- Injects the contract and test files
- Generates documentation from JSDoc tags
- Runs tests or compilation
- Creates incremental git commits"

## Inspect Generated Example (30 seconds)

"Let's look at what was generated."

```bash
cd scaffolded/basic-counter
git log --oneline --decorate -n 10
```

"Notice the template history is preserved, plus our new commits for the contract, tests, and README."

```bash
cat README.md
```

"The README was auto-generated from JSDoc tags in the test file, creating GitBook-compatible documentation."

## Run Tests (20 seconds)

"Let's verify the example works."

```bash
npm ci
npm test
```

"If FHE runtime isn't available, it falls back to compilation."

```bash
npx hardhat compile
```

## Scaffold All Examples (30 seconds)

"Now let's scaffold all configured examples at once."

```bash
cd ../..
npm run scaffold:all
```

"This creates multiple standalone repositories, each ready to push to GitHub."

## Review Deliverables (20 seconds)

"The generator produces detailed reports."

```bash
cat summary.txt
cat deliverables.json
```

"These show which examples were scaffolded, test results, and exact reproduction commands."

## Push to GitHub (20 seconds)

"To push an example to GitHub, update the remote and push the dedicated branch."

```bash
cd scaffolded/basic-counter
git remote set-url your-origin git@github.com:YOUR-USERNAME/basic-counter.git
git push your-origin fhevm-example/basic-counter
```

"Replace YOUR-USERNAME with your actual GitHub username."

## Conclusion (10 seconds)

"That's the FHEVM Examples Generator! It automates scaffolding, documentation, and testing for FHEVM examples. Check out the README for more details. Thanks!"

---

## Key Points to Emphasize

1. **Full History Preservation**: Template history is kept intact
2. **Incremental Commits**: Meaningful commit messages for each step
3. **Auto Documentation**: JSDoc tags generate GitBook-compatible READMEs
4. **Fallback Testing**: Compiles if FHE runtime unavailable
5. **Standalone Repos**: Each example is ready to push independently
6. **Automation**: Driver script scaffolds all examples
7. **CI/CD Ready**: GitHub Actions workflow included

## Visual Elements

- Show terminal output clearly
- Highlight git log showing preserved history
- Display generated README
- Show test output or compilation success
- Display deliverables.json structure

## Timing Breakdown

- Introduction: 15s
- Setup: 20s
- Scaffold single: 45s
- Inspect: 30s
- Test: 20s
- Scaffold all: 30s
- Deliverables: 20s
- Push: 20s
- Conclusion: 10s
- **Total: ~3:30 minutes**
