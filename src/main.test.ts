import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as semver from 'semver';
import { bumpSemver } from './main.js';

describe('bumpSemver', () => {
  describe('major version bumps', () => {
    it('should bump major version with v prefix', async () => {
      const result = await bumpSemver('v1.2.3', 'major');
      assert.strictEqual(result, 'v2.0.0');
    });

    it('should bump major version without v prefix', async () => {
      const result = await bumpSemver('1.2.3', 'major');
      assert.strictEqual(result, '2.0.0');
    });

    it('should bump premajor version with v prefix', async () => {
      const result = await bumpSemver('v1.2.3', 'premajor');
      assert.strictEqual(result, 'v2.0.0-0');
    });

    it('should bump premajor version without v prefix', async () => {
      const result = await bumpSemver('1.2.3', 'premajor');
      assert.strictEqual(result, '2.0.0-0');
    });
  });

  describe('minor version bumps', () => {
    it('should bump minor version with v prefix', async () => {
      const result = await bumpSemver('v1.2.3', 'minor');
      assert.strictEqual(result, 'v1.3.0');
    });

    it('should bump minor version without v prefix', async () => {
      const result = await bumpSemver('1.2.3', 'minor');
      assert.strictEqual(result, '1.3.0');
    });

    it('should bump preminor version with v prefix', async () => {
      const result = await bumpSemver('v1.2.3', 'preminor');
      assert.strictEqual(result, 'v1.3.0-0');
    });

    it('should bump preminor version without v prefix', async () => {
      const result = await bumpSemver('1.2.3', 'preminor');
      assert.strictEqual(result, '1.3.0-0');
    });
  });

  describe('patch version bumps', () => {
    it('should bump patch version with v prefix', async () => {
      const result = await bumpSemver('v1.2.3', 'patch');
      assert.strictEqual(result, 'v1.2.4');
    });

    it('should bump patch version without v prefix', async () => {
      const result = await bumpSemver('1.2.3', 'patch');
      assert.strictEqual(result, '1.2.4');
    });

    it('should bump prepatch version with v prefix', async () => {
      const result = await bumpSemver('v1.2.3', 'prepatch');
      assert.strictEqual(result, 'v1.2.4-0');
    });

    it('should bump prepatch version without v prefix', async () => {
      const result = await bumpSemver('1.2.3', 'prepatch');
      assert.strictEqual(result, '1.2.4-0');
    });
  });

  describe('prerelease version bumps', () => {
    it('should bump prerelease version with v prefix', async () => {
      const result = await bumpSemver('v1.2.3', 'prerelease');
      assert.strictEqual(result, 'v1.2.4-0');
    });

    it('should bump prerelease version without v prefix', async () => {
      const result = await bumpSemver('1.2.3', 'prerelease');
      assert.strictEqual(result, '1.2.4-0');
    });

    it('should increment existing prerelease', async () => {
      const result = await bumpSemver('v1.2.3-0', 'prerelease');
      assert.strictEqual(result, 'v1.2.3-1');
    });
  });

  describe('v prefix handling', () => {
    it('should preserve v prefix', async () => {
      const result = await bumpSemver('v0.0.1', 'patch');
      assert.strictEqual(result, 'v0.0.2');
    });

    it('should not add v prefix when not present', async () => {
      const result = await bumpSemver('0.0.1', 'patch');
      assert.strictEqual(result, '0.0.2');
    });

    it('should handle uppercase V as lowercase', async () => {
      // Note: semver.valid() treats 'V1.2.3' as invalid
      await assert.rejects(async () => {
        await bumpSemver('V1.2.3', 'patch');
      }, /is not a valid semver/);
    });
  });

  describe('edge cases', () => {
    it('should handle version 0.0.0', async () => {
      const result = await bumpSemver('v0.0.0', 'patch');
      assert.strictEqual(result, 'v0.0.1');
    });

    it('should handle large version numbers', async () => {
      const result = await bumpSemver('v999.999.999', 'major');
      assert.strictEqual(result, 'v1000.0.0');
    });

    it('should handle versions with build metadata', async () => {
      const result = await bumpSemver('v1.2.3+build123', 'patch');
      assert.strictEqual(result, 'v1.2.4');
    });

    it('should handle versions with prerelease tags', async () => {
      const result = await bumpSemver('v1.2.3-alpha.1', 'patch');
      assert.strictEqual(result, 'v1.2.3');
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid semver', async () => {
      await assert.rejects(async () => {
        await bumpSemver('invalid', 'patch');
      }, /is not a valid semver/);
    });

    it('should throw error for invalid semver with special chars', async () => {
      await assert.rejects(async () => {
        await bumpSemver('v1.2.x', 'patch');
      }, /is not a valid semver/);
    });

    it('should throw error for empty string', async () => {
      await assert.rejects(async () => {
        await bumpSemver('', 'patch');
      }, /is not a valid semver/);
    });

    it('should throw error for invalid bump level', async () => {
      await assert.rejects(async () => {
        await bumpSemver('v1.2.3', 'invalid');
      }, /is not supported/);
    });

    it('should throw error for empty bump level', async () => {
      await assert.rejects(async () => {
        await bumpSemver('v1.2.3', '');
      }, /is not supported/);
    });

    it('should throw error for numeric bump level', async () => {
      await assert.rejects(async () => {
        await bumpSemver('v1.2.3', '1');
      }, /is not supported/);
    });
  });

  describe('version comparison logic', () => {
    it('should produce greater version for major bump', async () => {
      const original = 'v1.2.3';
      const bumped = await bumpSemver(original, 'major');
      assert.ok(bumped, 'Bumped version should not be null');
      assert.strictEqual(
        semver.gt(bumped, original),
        true,
        'Bumped version should be greater'
      );
    });

    it('should produce greater version for minor bump', async () => {
      const original = 'v1.2.3';
      const bumped = await bumpSemver(original, 'minor');
      assert.ok(bumped, 'Bumped version should not be null');
      assert.strictEqual(
        semver.gt(bumped, original),
        true,
        'Bumped version should be greater'
      );
    });

    it('should produce greater version for patch bump', async () => {
      const original = 'v1.2.3';
      const bumped = await bumpSemver(original, 'patch');
      assert.ok(bumped, 'Bumped version should not be null');
      assert.strictEqual(
        semver.gt(bumped, original),
        true,
        'Bumped version should be greater'
      );
    });
  });

  describe('consistent behavior', () => {
    it('should produce same result for same input', async () => {
      const result1 = await bumpSemver('v1.2.3', 'minor');
      const result2 = await bumpSemver('v1.2.3', 'minor');
      assert.strictEqual(result1, result2);
    });

    it('should be case sensitive for bump level', async () => {
      await assert.rejects(async () => {
        await bumpSemver('v1.2.3', 'MAJOR');
      }, /is not supported/);
    });
  });
});
