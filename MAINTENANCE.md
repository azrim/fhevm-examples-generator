# Maintenance Guide

## Updating Dependencies

### Update Base Template

The base template is automatically cloned from the official Zama repository. To update:

```bash
# Remove old template
rm -rf base-template

# Re-run setup
npm run setup
```

### Update npm Dependencies

```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Update specific package
npm install package-name@latest
```

## Adding New Examples

### 1. Create Contract Template

Create `templates/contracts/your-example.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract YourExample is ZamaEthereumConfig {
    // Your contract code
}
```

### 2. Create Test Template

Create `templates/tests/your-example.test.ts` with JSDoc tags:

```typescript
/**
 * @title Your Example Test Suite
 * @purpose Brief description
 * @chapter Main Section
 */
describe('YourExample', function () {
  /**
   * @example Test Case Name
   * @note Important information
   */
  it('Should test something', async function () {
    // Test code
  });
});
```

### 3. Add to Scaffold Script

Edit `scripts/scaffold-all.ts`:

```typescript
{
  name: 'your-example',
  category: 'your-category',
  contractTemplate: 'templates/contracts/your-example.sol',
  testTemplate: 'templates/tests/your-example.test.ts',
}
```

### 4. Test Locally

```bash
# Scaffold your example
npm run cli your-example -- \
  --contractTemplate templates/contracts/your-example.sol \
  --testTemplate templates/tests/your-example.test.ts

# Test it
cd scaffolded/your-example
npm ci
npm test
```

## Version Updates

### When FHEVM Updates

1. Update base template (see above)
2. Check for breaking changes in contracts
3. Update import statements if needed
4. Test all examples
5. Update documentation

### When Node.js Updates

1. Update `.github/workflows/ci.yml`:

   ```yaml
   node-version: [XX.x] # Update version
   ```

2. Update `package.json`:

   ```json
   "engines": {
     "node": ">=XX"
   }
   ```

3. Test locally with new Node version

## Code Quality

### Run All Checks

```bash
# Run all validation
npm run validate

# Individual checks
npm run type-check  # TypeScript type checking
npm run lint        # ESLint
npm run format:check # Prettier
npm test            # Jest tests
```

### Fix Issues

```bash
# Auto-fix linting issues
npm run lint:fix

# Auto-format code
npm run format
```

## CI/CD Maintenance

### Update GitHub Actions

The CI automatically:

- Clones base-template
- Runs code quality checks
- Scaffolds all examples
- Tests all examples dynamically

No manual updates needed when adding examples!

### Troubleshooting CI

If CI fails:

1. **Git identity error**: Already configured in workflow
2. **Node version mismatch**: Update to Node 22+
3. **Test failures**: Check if base template updated
4. **Timeout**: Increase timeout in workflow

## Breaking Changes

### Handling FHEVM Updates

1. Clone new base template
2. Check changelog for breaking changes
3. Update contract templates
4. Update test templates
5. Run full test suite
6. Update documentation

### Migration Checklist

- [ ] Update base template
- [ ] Update contract imports
- [ ] Update function signatures
- [ ] Update test patterns
- [ ] Run all tests
- [ ] Update README
- [ ] Update examples
- [ ] Test CI pipeline

## Performance Optimization

### Faster Scaffolding

The generator already:

- Reuses base template (no re-cloning)
- Runs tests in parallel where possible
- Caches npm dependencies

### Reducing CI Time

- Code quality checks run before scaffolding
- Tests use fallback to compilation
- Artifacts upload only essential files

## Monitoring

### Check CI Status

Visit: https://github.com/azrim/fhevm-examples-generator/actions

### Review Deliverables

After scaffolding:

- `deliverables.json` - Test results
- `summary.txt` - Summary report

## Support

### Common Issues

**Issue**: Base template not found
**Solution**: Run `npm run setup`

**Issue**: Tests fail
**Solution**: Check Node version (need 22+)

**Issue**: Git errors
**Solution**: Configure git identity

### Getting Help

1. Check existing issues
2. Review documentation
3. Test with fresh clone
4. Check CI logs

## Best Practices

1. **Always test locally** before pushing
2. **Run validation** before committing
3. **Update docs** when adding features
4. **Keep dependencies** up to date
5. **Monitor CI** for failures
6. **Version control** all changes

## Automation

The generator is designed for minimal maintenance:

✅ Auto-clones base template
✅ Auto-discovers examples in CI
✅ Auto-generates documentation
✅ Auto-validates code quality
✅ Auto-tests all examples

Adding a new example requires only 3 files and 1 config entry!
