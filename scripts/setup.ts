#!/usr/bin/env node
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

const BASE_TEMPLATE_URL = 'https://github.com/zama-ai/fhevm-hardhat-template.git';
const BASE_TEMPLATE_DIR = path.resolve(process.cwd(), 'base-template');

async function setup() {
  console.log('🚀 FHEVM Examples Generator - Setup\n');

  // Check if base-template already exists
  if (await fs.pathExists(BASE_TEMPLATE_DIR)) {
    console.log('✅ base-template/ already exists');

    // Verify it's a valid git repository
    try {
      await execa('git', ['status'], { cwd: BASE_TEMPLATE_DIR });
      console.log('✅ base-template/ is a valid git repository');
      console.log('\n✨ Setup complete!\n');
      return;
    } catch (error) {
      console.log('⚠️  base-template/ exists but is not a valid git repository');
      console.log('   Removing and re-cloning...\n');
      await fs.remove(BASE_TEMPLATE_DIR);
    }
  }

  // Clone base template
  console.log(`📦 Cloning base template from: ${BASE_TEMPLATE_URL}`);
  console.log('   This may take a moment...\n');

  try {
    await execa('git', ['clone', BASE_TEMPLATE_URL, 'base-template'], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log('\n✅ Successfully cloned base template');
    console.log('✨ Setup complete!\n');
  } catch (error: any) {
    console.error('\n❌ Failed to clone base template');
    console.error(`   Error: ${error.message}\n`);
    console.error('Please ensure you have git installed and internet connectivity.');
    process.exit(1);
  }
}

setup().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
