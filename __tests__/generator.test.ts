import fs from 'fs-extra';
import path from 'path';

describe('FHEVM Examples Generator', () => {
  const baseTemplatePath = path.resolve(process.cwd(), 'base-template');
  const templatesPath = path.resolve(process.cwd(), 'templates');

  test('base-template directory exists', async () => {
    const exists = await fs.pathExists(baseTemplatePath);
    expect(exists).toBe(true);
  });

  test('base-template has package.json', async () => {
    const packageJsonPath = path.join(baseTemplatePath, 'package.json');
    const exists = await fs.pathExists(packageJsonPath);
    expect(exists).toBe(true);
  });

  test('contract templates exist', async () => {
    const basicCounterPath = path.join(templatesPath, 'contracts', 'basic-counter.sol');
    const arithmeticPath = path.join(templatesPath, 'contracts', 'arithmetic.sol');

    expect(await fs.pathExists(basicCounterPath)).toBe(true);
    expect(await fs.pathExists(arithmeticPath)).toBe(true);
  });

  test('test templates exist', async () => {
    const basicCounterTestPath = path.join(templatesPath, 'tests', 'basic-counter.test.ts');
    const arithmeticTestPath = path.join(templatesPath, 'tests', 'arithmetic.test.ts');

    expect(await fs.pathExists(basicCounterTestPath)).toBe(true);
    expect(await fs.pathExists(arithmeticTestPath)).toBe(true);
  });

  test('contract templates use correct imports', async () => {
    const basicCounterPath = path.join(templatesPath, 'contracts', 'basic-counter.sol');
    const content = await fs.readFile(basicCounterPath, 'utf-8');

    expect(content).toContain('@fhevm/solidity');
    expect(content).toContain('import {FHE');
    expect(content).toContain('ZamaEthereumConfig');
  });

  test('test templates have JSDoc tags', async () => {
    const basicCounterTestPath = path.join(templatesPath, 'tests', 'basic-counter.test.ts');
    const content = await fs.readFile(basicCounterTestPath, 'utf-8');

    expect(content).toContain('@title');
    expect(content).toContain('@purpose');
    expect(content).toContain('@chapter');
    expect(content).toContain('@example');
  });
});
