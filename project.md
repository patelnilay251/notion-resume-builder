# Project Overview

This repository contains a Notion-style resume builder application built with Next.js and TypeScript. The application allows users to create and customize their resumes using a block-based editor similar to Notion.

## Features

- **Block-Based Editor**: Create resume content using various block types (paragraphs, headings, lists, code, quotes, tables, todos, and toggles)
- **Theme Toggle**: Switch between light and dark themes
- **Font Selection**: Choose from different font options
- **Responsive Design**: Works on desktop and mobile devices
- **API Integration**: Resume data can be fetched and managed via API endpoints

## Project Structure

```
.
├── public/                  # Static assets
├── src/
│   ├── app/                # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── favicon.ico     # Favicon
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   │   ├── blocks/         # Block components
│   │   ├── Editor.tsx      # Main editor component
│   │   ├── FontSelector.tsx # Font selection
│   │   ├── Layout.tsx      # Layout component
│   │   ├── Sidebar.tsx      # Sidebar component
│   │   ├── ThemeProvider.tsx # Theme context
│   │   └── ThemeToggle.tsx  # Theme toggle
│   ├── hooks/              # Custom hooks
│   │   └── useResume.ts    # Resume data hook
│   ├── lib/                # Utility functions
│   │   ├── blocks.ts       # Block utilities
│   │   └── utils.ts        # General utilities
│   └── types/              # TypeScript types
│       └── blocks.ts      # Block types
├── .gitignore
├── eslint.config.mjs        # ESLint configuration
├── LICENSE                 # MIT License
├── next.config.ts          # Next.js configuration
├── package-lock.json
├── package.json
├── postcss.config.mjs       # PostCSS configuration
├── README.md              # Main README
├── tsconfig.json           # TypeScript configuration
└── project.md              # This file
```

## Key Components

### Editor Component
The main editor component (`src/components/Editor.tsx`) handles:
- Block creation and management
- Drag-and-drop reordering
- Content editing
- Block type switching

### Block Types
The application supports multiple block types defined in `src/components/blocks/`:
- **ParagraphBlock**: Basic text paragraphs
- **HeadingBlock**: Heading levels 1-3
- **ListBlock**: Bulleted and numbered lists
- **CodeBlock**: Syntax-highlighted code blocks
- **QuoteBlock**: Block quotes
- **TableBlock**: Tables with customizable columns
- **TodoBlock**: Checklist items
- **ToggleBlock**: Collapsible content sections

### Theme System
The theme system (`src/components/ThemeProvider.tsx` and `src/components/ThemeToggle.tsx`) provides:
- Light and dark theme support
- Theme persistence using localStorage
- Context API for theme management

### Font Selection
The font selector (`src/components/FontSelector.tsx`) allows users to:
- Choose from multiple font options
- Preview fonts before applying
- Persist font preferences

## Technical Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **State Management**: React Context API
- **Icons**: SVG icons
- **Build Tool**: Vite (via Next.js)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- `GET /api/resume`: Fetch resume data
- Additional endpoints can be added as needed

## Customization

The application can be customized by:
- Adding new block types in `src/components/blocks/`
- Modifying theme colors in `src/app/globals.css`
- Extending the API routes in `src/app/api/`
- Adding new font options in `src/components/FontSelector.tsx`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
