#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

const SCAFFOLDED_DIR = path.resolve(process.cwd(), 'scaffolded');
const DOCS_DIR = path.resolve(process.cwd(), 'docs');

interface Example {
  name: string;
  category: string;
  readmePath: string;
}

async function generateGitBook() {
  console.log('📚 Generating GitBook documentation...\n');

  // Ensure docs directory exists
  await fs.ensureDir(DOCS_DIR);

  // Find all scaffolded examples
  const exampleDirs = await glob('*/', { cwd: SCAFFOLDED_DIR });
  const examples: Example[] = [];

  for (const dir of exampleDirs) {
    const exampleName = dir.replace('/', '');
    const readmePath = path.join(SCAFFOLDED_DIR, exampleName, 'README.md');

    if (await fs.pathExists(readmePath)) {
      // Extract category from example name
      const category = extractCategory(exampleName);

      examples.push({
        name: exampleName,
        category,
        readmePath,
      });

      // Copy README to docs folder
      const docPath = path.join(DOCS_DIR, `${exampleName}.md`);
      await fs.copy(readmePath, docPath);
      console.log(`✅ Copied: ${exampleName}.md`);
    }
  }

  console.log(`\n📊 Generated ${examples.length} documentation files`);
  console.log('\n✨ GitBook documentation ready in docs/');
  console.log('\nNext steps:');
  console.log('1. Install GitBook CLI: npm install -g gitbook-cli');
  console.log('2. Initialize GitBook: cd docs && gitbook init');
  console.log('3. Serve locally: gitbook serve');
  console.log('4. Build: gitbook build');
}

function extractCategory(exampleName: string): string {
  const categoryMap: Record<string, string> = {
    'basic-counter': 'getting-started',
    arithmetic: 'operations',
    equality: 'comparisons',
    'encrypt-single-value': 'encryption',
    'access-control': 'permissions',
    'input-proofs': 'security',
    'blind-auction': 'advanced',
    'openzeppelin-erc7984': 'tokens',
  };

  return categoryMap[exampleName] || 'uncategorized';
}

generateGitBook().catch((error) => {
  console.error('❌ Error generating GitBook:', error);
  process.exit(1);
});
