#!/usr/bin/env node
import { execa } from 'execa';
import path from 'path';
import fs from 'fs-extra';

interface ExampleConfig {
  name: string;
  category: string;
  contractTemplate: string;
  testTemplate: string;
}

// Target examples from bounty requirements
const examples: ExampleConfig[] = [
  {
    name: 'basic-counter',
    category: 'getting-started',
    contractTemplate: 'templates/contracts/basic-counter.sol',
    testTemplate: 'templates/tests/basic-counter.test.ts',
  },
  {
    name: 'arithmetic',
    category: 'operations',
    contractTemplate: 'templates/contracts/arithmetic.sol',
    testTemplate: 'templates/tests/arithmetic.test.ts',
  },
  {
    name: 'equality',
    category: 'comparisons',
    contractTemplate: 'templates/contracts/equality.sol',
    testTemplate: 'templates/tests/equality.test.ts',
  },
  {
    name: 'encrypt-single-value',
    category: 'encryption',
    contractTemplate: 'templates/contracts/encrypt-single-value.sol',
    testTemplate: 'templates/tests/encrypt-single-value.test.ts',
  },
  {
    name: 'access-control',
    category: 'permissions',
    contractTemplate: 'templates/contracts/access-control.sol',
    testTemplate: 'templates/tests/access-control.test.ts',
  },
  {
    name: 'input-proofs',
    category: 'security',
    contractTemplate: 'templates/contracts/input-proofs.sol',
    testTemplate: 'templates/tests/input-proofs.test.ts',
  },
];

async function scaffoldAll() {
  console.log('🚀 FHEVM Examples Generator - Scaffold All Examples\n');
  console.log(`📋 Scaffolding ${examples.length} example(s)...\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const example of examples) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Processing: ${example.name}`);
    console.log(`${'='.repeat(60)}`);

    try {
      const args = [
        'tsx',
        'src/cli/create-fhevm-example.ts',
        example.name,
        '--category', example.category,
        '--contractTemplate', example.contractTemplate,
        '--testTemplate', example.testTemplate,
        '--outDir', './scaffolded',
      ];

      await execa('npx', args, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });

      console.log(`✅ Successfully scaffolded: ${example.name}`);
      successCount++;
      results.push({ name: example.name, success: true });
    } catch (error: any) {
      console.error(`❌ Failed to scaffold: ${example.name}`);
      console.error(`   Error: ${error.message}`);
      failCount++;
      results.push({ name: example.name, success: false, error: error.message });
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SCAFFOLD SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Total: ${examples.length}`);

  // Update summary.txt
  const summaryPath = path.resolve('summary.txt');
  let summary = `FHEVM Examples Generator - Scaffold Summary
Generated: ${new Date().toISOString()}

RESULTS:
`;

  for (const result of results) {
    summary += `  ${result.success ? '✅' : '❌'} ${result.name}`;
    if (!result.success && result.error) {
      summary += ` - ${result.error}`;
    }
    summary += '\n';
  }

  summary += `
STATISTICS:
  Successful: ${successCount}
  Failed: ${failCount}
  Total: ${examples.length}

REPRODUCTION COMMANDS:
To reproduce locally, run:

  npm ci
  npm run scaffold:all

Or scaffold individual examples:

  npm run cli basic-counter -- --contractTemplate templates/contracts/basic-counter.sol --testTemplate templates/tests/basic-counter.test.ts
  npm run cli arithmetic -- --contractTemplate templates/contracts/arithmetic.sol --testTemplate templates/tests/arithmetic.test.ts

PUSHING TO GITHUB:
For each scaffolded example in ./scaffolded/, navigate to the directory and push:

  cd scaffolded/basic-counter
  git remote set-url your-origin git@github.com:YOUR-USERNAME/basic-counter.git
  git push your-origin fhevm-example/basic-counter

Replace YOUR-USERNAME with your actual GitHub username.

DELIVERABLES:
  - deliverables.json: Detailed results for each example
  - summary.txt: This file
  - scaffolded/: Directory containing all generated examples
`;

  await fs.writeFile(summaryPath, summary);
  console.log(`\n📄 Summary written to: ${summaryPath}`);

  // Check deliverables.json
  const deliverablePath = path.resolve('deliverables.json');
  if (await fs.pathExists(deliverablePath)) {
    console.log(`📊 Deliverables written to: ${deliverablePath}`);
  }

  console.log(`\n✨ Scaffold complete!\n`);

  process.exit(failCount > 0 ? 1 : 0);
}

scaffoldAll().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

