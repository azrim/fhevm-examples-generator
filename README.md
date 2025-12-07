# FHEVM Examples Generator

Production-ready tooling to scaffold standalone Hardhat FHEVM example repositories from the official [Zama Hardhat template](https://github.com/zama-ai/fhevm-hardhat-template).

## 🎥 Demo Video

https://github.com/user-attachments/assets/6f3389b8-e7be-4cb2-ab7a-89df8d7ff2ed

> **Note:** This demo video was created as part of the bounty submission. Due to a form submission oversight, the video link was not included in the initial submission form. The video is now available here and demonstrates all required functionality. See [SUBMISSION_NOTE.md](SUBMISSION_NOTE.md) for details.

---

**Repository:** https://github.com/azrim/fhevm-examples-generator

**Bounty:** [Build the FHEVM Example Hub - December 2025](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)

**Status:** ✅ 13 Examples | 90+ Tests | Code Quality Tools | Production Ready

## Features

- 🚀 **CLI Tool**: `create-fhevm-example` scaffolds standalone repos with full git history
- 📚 **Doc Generator**: Parses JSDoc/TSDoc tags to create GitBook-compatible READMEs
- 🧪 **Example Templates**: Starter contracts and tests for coatterns
- 🤖 **Automation**: Driver script to scaffold all examples at once
- ✅ **CI/CD**: GitHub Actions workflow to test all scaffolded examples
- 📊 **Reporting**: JSON deliverables with test results and timestamps

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 9
- Git

### Installation

```bash
# Clone this repository
git clone https://github.com/azrim/fhevm-examples-generator.git
cd fhevm-examples-generator

# Install dependencies (automatically clones base-template)
npm ci
```

The base template is automatically cloned during `npm ci` via the `postinstall` hook.

### Scaffold a Single Example

```bash
npm run cli basic-counter -- \
  --contractTemplate templates/contracts/basic-counter.sol \
  --testTemplate templates/tests/basic-counter.test.ts
```

This creates `./scaffolded/basic-counter/` with:

- Full base template history preserved
- Dedicated branch `fhevm-example/basic-counter`
- Injected contract and test files
- Auto-generated README.md
- Incremental git commits
- Placeholder remote configured

### Scaffold All Examples

```bash
npm run scaffold:all
```

This scaffolds all configured examples into `./scaffolded/`.

## CLI Usage

```bash
npx tsx src/cli/create-fhevm-example.ts <name> [options]

Options:
  --category <string>          Category (default: "uncategorized")
  --contractTemplate <path>    Path to contract template
  --testTemplate <path>        Path to test template
  --outDir <path>              Output directory (default: "./scaffolded")
  --initGit <boolean>          Initialize git (default: true)
```

### Example

```bash
npx tsx src/cli/create-fhevm-example.ts my-example \
  --category operations \
  --contractTemplate templates/contracts/arithmetic.sol \
  --testTemplate templates/tests/arithmetic.test.ts
```

## Documentation Generator

The doc generator parses JSDoc/TSDoc tags from test files:

- `@title`: Example title
- `@purpose`: Short description
- `@chapter`: Section heading
- `@example`: Example subsection
- `@note`: Important notes

### Supported Tags

```typescript
/**
 * @title My Example Title
 * @purpose This example demonstrates X
 * @chapter Getting Started
 * @example Basic Usage
 * @note This requires FHE runtime
 */
```

The generator produces GitBook-compatible Markdown with:

- Title and description
- Chapter sections
- Example subsections
- Note callouts
- How to run tests
- What the example teaches

## Project Structure

```
fhevm-examples-generator/
├── base-template/              # Cloned Zama Hardhat template
├── src/
│   ├── cli/
│   │   └── create-fhevm-example.ts   # Main CLI tool
│   └── docgen/
│       └── generate-docs.ts          # Documentation generator
├── templates/
│   ├── contracts/
│   │   ├── basic-counter.sol
│   │   └── arithmetic.sol
│   └── tests/
│       ├── basic-counter.test.ts
│       └── arithmetic.test.ts
├── scripts/
│   └── scaffold-all.ts         # Driver script
├── .github/
│   └── workflows/
│       └── ci.yml              # CI workflow
├── scaffolded/                 # Generated examples (gitignored)
├── deliverables.json           # Test results
├── summary.txt                 # Human-readable summary
└── README.md                   # This file
```

## Adding New Templates

1. Create contract template in `templates/contracts/<name>.sol`
2. Create test template in `templates/tests/<name>.test.ts`
3. Add JSDoc tags to test file for documentation
4. Add entry to `scripts/scaffold-all.ts`:

```typescript
{
  name: 'my-example',
  category: 'my-category',
  contractTemplate: 'templates/contracts/my-example.sol',
  testTemplate: 'templates/tests/my-example.test.ts',
}
```

## Changing Base Template

To use a different base template:

1. Update `BASE_TEMPLATE_REPO` in `src/cli/create-fhevm-example.ts`
2. Remove existing `base-template/` directory
3. Clone new template:

```bash
rm -rf base-template
git clone <new-template-url> base-template
```

## Git Behavior

The CLI preserves full template history and creates incremental commits:

1. Clones base template with full history (no `--depth`)
2. Creates dedicated branch `fhevm-example/<name>`
3. Commits contract: `feat: add <name> contract`
4. Commits tests: `test: add tests for <name>`
5. Commits README: `docs: add autogenerated README`
6. Removes upstream remotes
7. Adds placeholder remote `your-origin`

**Important:** Template history is preserved. Do NOT run `rm -rf .git`.

## Pushing to GitHub

For each scaffolded example:

```bash
cd scaffolded/<example-name>

# Update remote URL
git remote set-url your-origin git@github.com:YOUR-USERNAME/<example-name>.git

# Push to GitHub
git push your-origin fhevm-example/<example-name>
```

Replace `YOUR-USERNAME` with your GitHub username.

## CI/CD

The included GitHub Actions workflow:

1. Installs dependencies
2. Runs `npm run scaffold:all`
3. Tests each scaffolded example
4. Uploads deliverables as artifacts

To enable CI, push this repo to GitHub and the workflow runs automatically.

## Testing

The generator includes basic tests:

```bash
npm test
```

Each scaffolded example can be tested:

```bash
cd scaffolded/<example-name>
npm ci
npm test
```

If FHE runtime is unavailable, tests fall back to compilation:

```bash
npx hardhat compile
```

## Deliverables

The generator produces:

- `deliverables.json`: Detailed results per example with test status
- `summary.txt`: Human-readable summary with reproduction commands
- `scaffolded/`: All generated example repositories (gitignored)

Current status: **13 examples, 90+ passing tests, full code quality tooling**

## Available Examples

All 13 examples are ready to scaffold:

### Basic Operations (3)
- ✅ **basic-counter** - Simple encrypted counter with increment/decrement
- ✅ **arithmetic** - FHE arithmetic operations (add, subtract, multiply)
- ✅ **equality** - Equality comparison and conditional selection (FHE.eq, FHE.select)

### Encryption (2)
- ✅ **encrypt-single-value** - Single value encryption with input proofs
- ✅ **encrypt-multiple-values** - Batch encryption of multiple values (euint8, euint16, euint32)

### User Decryption (2)
- ✅ **user-decrypt-single** - User-side decryption of single encrypted value
- ✅ **user-decrypt-multiple** - User-side decryption of multiple encrypted values

### Public Decryption (2)
- ✅ **public-decrypt-single** - On-chain public decryption (FHE.decrypt)
- ✅ **public-decrypt-multiple** - Public decryption of multiple values

### Advanced (4)
- ✅ **access-control** - Permission management (FHE.allow, FHE.allowThis, FHE.allowTransient)
- ✅ **input-proofs** - Input proof validation and best practices
- ✅ **blind-auction** - Sealed-bid auction with encrypted bids
- ✅ **openzeppelin-erc7984** - Confidential ERC20 token (ERC-7984 standard)
- handles-lifecycle

Bonus:

- openzeppelin-erc7984
- blind-auction

## Submission

Ready to submit! See `FINAL_SUBMISSION_GUIDE.md` for submission instructions.

## Troubleshooting

### npm ci fails in scaffolded repo

Ensure the base template's `package.json` is valid and dependencies are available.

### Tests fail

If FHE runtime is unavailable, the CLI falls back to `npx hardhat compile`. Check that contracts compile successfully.

### Git history missing

Ensure you're not using `--depth` when cloning the base template. The CLI preserves full history.

### Remote push fails

Update the remote URL with your actual GitHub username:

```bash
git remote set-url your-origin git@github.com:YOUR-USERNAME/repo-name.git
```

## Documentation

- **README.md** (this file) - Main usage guide
- **SUBMISSION.md** - Comprehensive bounty submission document
- **FINAL_SUBMISSION_GUIDE.md** - Quick submission instructions
- **MAINTENANCE.md** - Guide for updates and adding new examples
- **BASE_TEMPLATE_NOTE.md** - Information about the base template
- **QUICK_START.md** - Quick start for reviewers

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Bounty Page](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)

## License

MIT
