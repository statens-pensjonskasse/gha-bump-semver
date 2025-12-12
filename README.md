# GHA Bump SemVer

[![Build and Release](https://github.com/statens-pensjonskasse/gha-bump-semver/actions/workflows/build-and-release.yaml/badge.svg)](https://github.com/statens-pensjonskasse/gha-bump-semver/actions/workflows/build-and-release.yaml)
[![Latest Release](https://img.shields.io/github/v/release/statens-pensjonskasse/gha-bump-semver)](https://github.com/statens-pensjonskasse/gha-bump-semver/releases/latest)
[![License](https://img.shields.io/github/license/statens-pensjonskasse/gha-bump-semver)](LICENSE)

This is a GitHub Action to bump the given semver version up. Part of SPK's public actions library.

## Features

✅ Supports all semver bump levels (major, minor, patch, pre-releases...)  
✅ Preserves `v` prefix in versions (e.g., `v1.2.3` → `v2.0.0`)  
✅ Zero dependencies runtime  
✅ Built with TypeScript and modern tooling  
✅ Comprehensive test coverage  
✅ Node 24+ with built-in test runner

## Inputs

| Name              | Description                                                                               | Required | Default |
|-------------------|-------------------------------------------------------------------------------------------|----------|---------|
| `current_version` | The current semantic version                                                              | Yes      | -       |
| `level`           | Version bump level: `major`, `minor`, `patch`, `premajor`, `preminor`, `prepatch`, `prerelease` | No       | `minor` |

## Outputs

| Name          | Description                   |
|---------------|-------------------------------|
| `new_version` | The bumped semantic version   |

## Usage Examples

### Basic Usage

Bump a minor version (default):

```yaml
- name: Bump version
  id: bump
  uses: statens-pensjonskasse/gha-bump-semver@v1
  with:
    current_version: 'v1.2.3'

- name: Use new version
  run: echo "New version is ${{ steps.bump.outputs.new_version }}"
  # Output: New version is v1.3.0
```

### Specify Bump Level

```yaml
- name: Bump major version
  id: bump
  uses: statens-pensjonskasse/gha-bump-semver@v1
  with:
    current_version: 'v1.2.3'
    level: 'major'

- name: Use new version
  run: echo "New version is ${{ steps.bump.outputs.new_version }}"
  # Output: New version is v2.0.0
```

### Version Bump Examples

| Input Version | Level       | Output Version |
|---------------|-------------|----------------|
| `v1.2.3`      | `major`     | `v2.0.0`       |
| `v1.2.3`      | `minor`     | `v1.3.0`       |
| `v1.2.3`      | `patch`     | `v1.2.4`       |
| `v1.2.3`      | `premajor`  | `v2.0.0-0`     |
| `v1.2.3`      | `preminor`  | `v1.3.0-0`     |
| `v1.2.3`      | `prepatch`  | `v1.2.4-0`     |
| `v1.2.3`      | `prerelease`| `v1.2.4-0`     |
| `1.2.3`       | `major`     | `2.0.0`        |
| `1.2.3`       | `minor`     | `1.3.0`        |

> **Note:** The `v` prefix is preserved if present in the input version.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run all` to format, test, and build
5. Commit your changes (the dist/ folder should be committed)
6. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This is a derivative work based on [action-bump-semver](https://github.com/actions-ecosystem/action-bump-semver) 
by The Actions Ecosystem Authors (Apache 2.0). See [NOTICE](NOTICE) for full attribution and changes.

## Maintainers

Maintained by Team AppArk.

