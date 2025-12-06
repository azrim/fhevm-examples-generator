# GitBook Documentation

This directory contains GitBook-compatible documentation for all FHEVM examples.

## Quick Start

### Option 1: GitBook CLI (Local)

```bash
# Install GitBook CLI globally
npm install -g gitbook-cli

# Navigate to docs folder
cd docs

# Initialize GitBook
gitbook init

# Serve locally (opens at http://localhost:4000)
gitbook serve

# Or build static site
gitbook build
```

### Option 2: GitBook.com (Cloud)

1. Go to [GitBook.com](https://www.gitbook.com/)
2. Sign in with GitHub
3. Import this repository
4. GitBook will automatically detect the `docs/` folder
5. Your documentation will be live!

### Option 3: GitHub Pages

```bash
# Build static site
cd docs
gitbook build

# The _book/ folder contains the static site
# Deploy to GitHub Pages or any static host
```

## Structure

- `README.md` - Homepage/Introduction
- `SUMMARY.md` - Table of contents (sidebar navigation)
- `*.md` - Individual example documentation pages
- `.gitbook.yaml` - GitBook configuration

## Updating Documentation

After scaffolding new examples:

```bash
# Scaffold all examples
npm run scaffold:all

# Generate GitBook docs from scaffolded READMEs
npm run gitbook

# The docs/ folder will be updated with new example pages
```

## Customization

### Edit SUMMARY.md

Update the table of contents to organize examples:

```markdown
# Table of contents

- [Introduction](README.md)

## Getting Started

- [Basic Counter](basic-counter.md)

## Advanced

- [Blind Auction](blind-auction.md)
```

### Edit README.md

Customize the homepage with:

- Project overview
- Getting started guide
- Key concepts
- Resources

### Styling

Create a `book.json` for custom styling:

```json
{
  "title": "FHEVM Examples Hub",
  "description": "Comprehensive FHEVM examples and tutorials",
  "author": "Your Name",
  "language": "en",
  "plugins": ["theme-default"],
  "pluginsConfig": {
    "theme-default": {
      "showLevel": true
    }
  }
}
```

## Publishing

### GitHub Pages

```bash
# Build
cd docs
gitbook build

# Deploy _book/ folder to gh-pages branch
git subtree push --prefix docs/_book origin gh-pages
```

### GitBook.com

1. Connect your GitHub repository
2. GitBook auto-deploys on every push
3. Get a free `.gitbook.io` subdomain

### Netlify/Vercel

1. Connect repository
2. Set build command: `cd docs && gitbook build`
3. Set publish directory: `docs/_book`

## Features

✅ **Auto-generated** - Docs created from scaffolded example READMEs
✅ **GitBook compatible** - Works with GitBook CLI and GitBook.com
✅ **Searchable** - Full-text search built-in
✅ **Responsive** - Mobile-friendly design
✅ **Versioning** - Support for multiple versions
✅ **Customizable** - Themes and plugins available

## Resources

- [GitBook Documentation](https://docs.gitbook.com/)
- [GitBook CLI](https://github.com/GitbookIO/gitbook-cli)
- [GitBook Plugins](https://plugins.gitbook.com/)
