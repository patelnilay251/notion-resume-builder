# 📄 Notion-Style Resume Builder

A beautiful, interactive resume builder inspired by Notion's clean design and smooth user experience. Create professional resumes with real-time editing, smooth animations, and a pixel-perfect Notion-like interface.

## ✨ Features

- **🎨 Notion-Inspired Design**: Exact color palette, typography, and spacing
- **✏️ Real-time Editing**: ContentEditable blocks with live updates
- **🎯 Block-Based Architecture**: Headings, paragraphs, lists, callouts, and more
- **💫 Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **📱 Responsive Design**: Perfect on desktop, tablet, and mobile
- **💾 Auto-save**: Automatic saving with manual save option
- **🎪 Interactive Sidebar**: Collapsible navigation with templates
- **🚀 Modern Stack**: Next.js, TypeScript, Tailwind CSS, Framer Motion

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Serverless Functions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd resume-notion
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── blocks/         # Block-specific components
│   ├── Editor.tsx      # Main editor component
│   ├── Layout.tsx      # App layout
│   └── Sidebar.tsx     # Navigation sidebar
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## 🎯 Core Concepts

### Block-Based Architecture
The editor uses a Notion-like block system where each piece of content is a block with:
- Unique ID
- Block type (heading, paragraph, list, etc.)
- Properties (text content, formatting, etc.)
- Parent-child relationships

### Block Types Supported
- **Text**: Basic paragraphs
- **Headings**: H1, H2, H3 with proper hierarchy
- **Lists**: Bulleted and numbered lists
- **Todo**: Interactive checkboxes
- **Callout**: Highlighted information boxes
- **Quote**: Styled quotations
- **Divider**: Section separators

## 🎨 Design System

The application uses Notion's exact design tokens:
- **Colors**: `#37352f` (text), `#6f6e69` (secondary), `#2383e2` (blue)
- **Typography**: System font stack with proper scales
- **Spacing**: Consistent 8px grid system
- **Animations**: Spring physics for natural motion

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Manual Deployment

```bash
npm run build
npm start
```

## 🛣️ Roadmap

- [ ] Multiple resume templates
- [ ] PDF export functionality
- [ ] Collaboration features
- [ ] Advanced text formatting
- [ ] Custom themes
- [ ] Database persistence
- [ ] User authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Notion](https://notion.so) for the amazing design system
- Built with [Next.js](https://nextjs.org) and [Framer Motion](https://framer.com/motion)
- Icons by [Lucide](https://lucide.dev)

## 📧 Contact

For questions or feedback, feel free to reach out!

---

**Built with ❤️ and lots of ☕**