#!/usr/bin/env node
import { glob } from 'glob';
import path from 'path';
import { validateTemplates } from '../src/validation/template-validator.js';

async function validateAllTemplates() {
  console.log('🔍 Validating all templates...\n');

  const contractFiles = await glob('templates/contracts/*.sol');

  let totalErrors = 0;
  let totalWarnings = 0;
  let validCount = 0;

  for (const contractFile of contractFiles) {
    const baseName = path.basename(contractFile, '.sol');
    const testFile = `templates/tests/${baseName}.test.ts`;

    console.log(`📋 Validating: ${baseName}`);

    const results = await validateTemplates(contractFile, testFile);

    // Contract validation
    if (results.contract.errors.length > 0) {
      console.log(`  ❌ Contract errors:`);
      results.contract.errors.forEach((err) => console.log(`     - ${err}`));
      totalErrors += results.contract.errors.length;
    }

    if (results.contract.warnings.length > 0) {
      console.log(`  ⚠️  Contract warnings:`);
      results.contract.warnings.forEach((warn) => console.log(`     - ${warn}`));
      totalWarnings += results.contract.warnings.length;
    }

    // Test validation
    if (results.test.errors.length > 0) {
      console.log(`  ❌ Test errors:`);
      results.test.errors.forEach((err) => console.log(`     - ${err}`));
      totalErrors += results.test.errors.length;
    }

    if (results.test.warnings.length > 0) {
      console.log(`  ⚠️  Test warnings:`);
      results.test.warnings.forEach((warn) => console.log(`     - ${warn}`));
      totalWarnings += results.test.warnings.length;
    }

    if (results.contract.valid && results.test.valid) {
      console.log(`  ✅ Valid`);
      validCount++;
    }

    console.log('');
  }

  console.log('═'.repeat(60));
  console.log('📊 Validation Summary');
  console.log('═'.repeat(60));
  console.log(`✅ Valid templates: ${validCount}/${contractFiles.length}`);
  console.log(`❌ Total errors: ${totalErrors}`);
  console.log(`⚠️  Total warnings: ${totalWarnings}`);
  console.log('');

  if (totalErrors > 0) {
    console.error('❌ Template validation failed!');
    process.exit(1);
  }

  console.log('✨ All templates validated successfully!\n');
}

validateAllTemplates().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
