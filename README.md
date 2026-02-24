<h1 align="center" id="title">ArkoiSystems Blog</h1>

> Building compilers, kernels, and developer tools from scratch. A terminal-themed blog exploring systems programming and low-level software development.

[![Deploy Status](https://img.shields.io/badge/deploy-automated-brightgreen)](https://arkoisystems.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3.9-orange)](https://bun.sh/)

---

## 📖 Overview

**ArkoiSystems Blog** is a modern blogging platform built with Next.js 16 and styled with a unique terminal aesthetic. The blog focuses on systems programming, compiler design, kernel development, and low-level software engineering topics.

This project showcases:

- **Terminal-themed UI** with dark/light mode support
- **Static site generation** for lightning-fast page loads
- **Markdown-based content** with frontmatter validation
- **Type-safe development** with TypeScript and Zod schemas
- **Containerized deployment** with Docker
- **Automated CI/CD** with GitHub Actions

**Live Site:** [https://arkoisystems.com](https://arkoisystems.com)

---

## ✨ Features

### Core Features

- **Blog Posts**: Markdown-based articles with syntax highlighting
- **Tag System**: Browse and filter posts by technology tags
- **About Page**: Dynamic content loaded from Markdown
- **RSS Feed**: Auto-generated RSS feed at `/rss.xml`

### Design Features

- **Dark/Light Mode**: System-aware theme switching with manual override
- **Terminal Aesthetic**: Command-line inspired interface with JetBrains Mono font
- **Syntax Highlighting**: Beautiful code blocks with copy functionality
- **Atomic Design**: Component architecture (atoms, molecules, organisms, templates)
- **Responsive Design**: Optimized for mobile and desktop

### Developer Features

- **Content Validation**: Automated validation of Markdown frontmatter
- **Type Safety**: Zod schemas for runtime validation
- **ESLint & Prettier**: Code quality and formatting
- **Quality Checks**: Automated linting, typechecking, and formatting
- **Standalone Builds**: Self-contained production deployments
- **Docker Support**: Multi-stage builds with health checks

---

## 🚀 Installation

### Prerequisites

- **Bun** 1.3.9 or higher ([installation guide](https://bun.sh/docs/installation))
- **Node.js** 24+ (if not using Bun)
- **Git**

### Quick Start

1. **Clone the repository:**

```bash
git clone git@github.com:ArkoiSystems/arkoi_blog.git
cd arkoi_blog
```

2. **Install dependencies:**

```bash
bun install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run the development server:**

```bash
bun run dev
```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📝 Creating Blog Posts

1. **Create a new Markdown file** in `content/posts/`:

```bash
touch content/posts/my-awesome-post.md
```

2. **Add frontmatter and content:**

```markdown
---
title: "My Awesome Post"
description: "A detailed exploration of awesome things"
date: "2025-02-21"
author: "Your Name"
tags: ["compiler", "systems", "low-level"]
published: true
---

# Your content here

Write your blog post content in Markdown...
```

3. **Validate your content:**

```bash
bun run validate-content
```

Your post will be available at `/posts/my-awesome-post`

---

## 🛠️ Available Scripts

```bash
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint
bun run format           # Format code with Prettier
bun run format:check     # Check code formatting
bun run typecheck        # Run TypeScript type checking
bun run validate-content # Validate blog post frontmatter
bun run test             # Run all checks (lint, format, typecheck, validate)
```

---

## 🐋 Deployment

### Docker

Build and run with Docker:

```bash
# Build the image
docker build -t arkoi-blog .

# Run the container
docker run -p 3000:3000 arkoi-blog
```

### Docker Compose

```bash
docker-compose up -d
```

---

## ✅ Requirements

### System Requirements

- **OS:** Linux, macOS, or Windows (with WSL2)
- **RAM:** 2GB minimum, 4GB recommended
- **CPU:** Modern multi-core processor

### Software Dependencies

- **Bun** 1.3.9+ or **Node.js** 24+
- **Git** for version control
- **Docker** (optional, for containerized deployment)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📜 License

This project is licensed under the BSD 3-Clause License. See the [LICENSE](LICENSE.txt) file for details.

---

<div align="center">
<em>Exploring the depths of systems programming, one commit at a time.</em>
</div>
