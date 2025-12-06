# Base Template Note

## About base-template/

The `base-template/` directory contains a full clone of the official Zama FHEVM Hardhat template from:
https://github.com/zama-ai/fhevm-hardhat-template

### Automatic Setup

The base template is **automatically cloned** when you run `npm ci` via a postinstall hook.

### Why it's not in git

The base template is **not tracked in this repository's git** because:

1. It's a complete clone with its own git history (113 commits)
2. Including it would bloat this repository unnecessarily
3. It's automatically managed by the setup script

### Manual Setup

If needed, you can manually clone or re-clone the base template:

```bash
# Run setup script
npm run setup

# Or clone manually
git clone https://github.com/zama-ai/fhevm-hardhat-template.git base-template
```

### Verification

To verify the base template is correct:

```bash
cd base-template
git remote -v
# Should show: origin  https://github.com/zama-ai/fhevm-hardhat-template.git

git log --oneline -n 5
# Should show recent commits from the official template
```

### Used by the generator

The CLI tool (`src/cli/create-fhevm-example.ts`) uses this base template to:

1. Copy the full template structure to each scaffolded example
2. Preserve the complete git history (no shallow clones)
3. Create dedicated branches for each example
4. Inject custom contracts and tests
5. Generate documentation

### Important

- The base template is cloned **with full history** (no `--depth` flag)
- Each scaffolded example gets its own copy with preserved history
- The template's git history is visible in scaffolded examples
- This ensures proper attribution and traceability

## For Reviewers

If you're reviewing this submission and need the base template:

```bash
# Clone the submission repo
git clone https://github.com/azrim/fhevm-examples-generator.git
cd fhevm-examples-generator

# Clone the base template
git clone https://github.com/zama-ai/fhevm-hardhat-template.git base-template

# Now you can run the generator
npm ci
npm run scaffold:all
```

The scaffolded examples in `scaffolded/` will have the full base template history preserved.
