import fs from 'fs-extra';
import path from 'path';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a Solidity contract template
 */
export async function validateContractTemplate(
  templatePath: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Check if file exists
  if (!(await fs.pathExists(templatePath))) {
    result.valid = false;
    result.errors.push(`Contract template not found: ${templatePath}`);
    return result;
  }

  const content = await fs.readFile(templatePath, 'utf-8');

  // Check for required imports
  if (!content.includes('@fhevm/solidity')) {
    result.errors.push('Missing @fhevm/solidity import');
    result.valid = false;
  }

  if (!content.includes('ZamaEthereumConfig')) {
    result.warnings.push('Contract should extend ZamaEthereumConfig');
  }

  // Check for SPDX license
  if (!content.includes('SPDX-License-Identifier')) {
    result.warnings.push('Missing SPDX license identifier');
  }

  // Check for pragma
  if (!content.includes('pragma solidity')) {
    result.errors.push('Missing pragma solidity statement');
    result.valid = false;
  }

  // Check for FHE usage
  if (!content.includes('FHE.')) {
    result.warnings.push('No FHE operations found in contract');
  }

  return result;
}

/**
 * Validates a test template
 */
export async function validateTestTemplate(templatePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Check if file exists
  if (!(await fs.pathExists(templatePath))) {
    result.valid = false;
    result.errors.push(`Test template not found: ${templatePath}`);
    return result;
  }

  const content = await fs.readFile(templatePath, 'utf-8');

  // Check for required imports
  if (!content.includes('ethers')) {
    result.errors.push('Missing ethers import');
    result.valid = false;
  }

  if (!content.includes('expect')) {
    result.errors.push('Missing chai expect import');
    result.valid = false;
  }

  // Check for JSDoc tags
  const hasTitle = content.includes('@title');
  const hasPurpose = content.includes('@purpose');
  const hasChapter = content.includes('@chapter');
  const hasExample = content.includes('@example');

  if (!hasTitle) {
    result.warnings.push('Missing @title JSDoc tag');
  }

  if (!hasPurpose) {
    result.warnings.push('Missing @purpose JSDoc tag');
  }

  if (!hasChapter) {
    result.warnings.push('Missing @chapter JSDoc tag');
  }

  if (!hasExample) {
    result.warnings.push('Missing @example JSDoc tag');
  }

  // Check for describe block
  if (!content.includes('describe(')) {
    result.errors.push('Missing describe block');
    result.valid = false;
  }

  // Check for test cases
  if (!content.includes('it(')) {
    result.errors.push('Missing test cases (it blocks)');
    result.valid = false;
  }

  return result;
}

/**
 * Validates both contract and test templates
 */
export async function validateTemplates(
  contractPath: string,
  testPath: string
): Promise<{ contract: ValidationResult; test: ValidationResult }> {
  const [contract, test] = await Promise.all([
    validateContractTemplate(contractPath),
    validateTestTemplate(testPath),
  ]);

  return { contract, test };
}
