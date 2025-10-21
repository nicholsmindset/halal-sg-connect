# Halal SG Connect 🕌

A comprehensive directory platform for halal businesses in Singapore, built with modern web technologies.

[![GitHub](https://img.shields.io/badge/GitHub-nicholsmindset%2Fhalal--sg--connect-blue)](https://github.com/nicholsmindset/halal-sg-connect)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-blue)](https://vitejs.dev/)

## 🌟 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Comprehensive UI**: shadcn/ui components with dark mode support
- **Business Directory**: Rich business profiles with ratings, images, and detailed info
- **Advanced Search**: AI-powered search with personalized recommendations
- **Premium Features**: Subscription tiers for enhanced business listings
- **Admin Dashboard**: Complete admin panel for business and user management
- **Mobile Responsive**: Optimized for all device sizes
- **Performance Optimized**: Code splitting, lazy loading, and bundle optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/nicholsmindset/halal-sg-connect.git
cd halal-sg-connect

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080) to see the application.

## 🛠️ Development

### Available Scripts

| Script                  | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start development server     |
| `npm run build`         | Build for production         |
| `npm run preview`       | Preview production build     |
| `npm run lint`          | Run ESLint with auto-fix     |
| `npm run format`        | Format code with Prettier    |
| `npm run type-check`    | Run TypeScript type checking |
| `npm run test`          | Run unit tests               |
| `npm run test:e2e`      | Run end-to-end tests         |
| `npm run test:coverage` | Run tests with coverage      |
| `npm run check-all`     | Run all quality checks       |

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key

# App Configuration
VITE_APP_NAME=Halal SG Connect
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context
- **Routing**: React Router v6
- **Backend**: Supabase (Auth, Database, Storage)
- **Testing**: Vitest + Playwright
- **Code Quality**: ESLint, Prettier, Husky

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Design system components
│   ├── forms/          # Form components
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
├── integrations/       # External service integrations
└── test/               # Test utilities
```

## 🧪 Testing

We use a comprehensive testing strategy:

- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage Target**: 80%+

```bash
# Run all tests
npm run test:all

# Run tests in watch mode
npm run test

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

### Build Optimization

The application is optimized for production with:

- Code splitting by route and vendor chunks
- Tree shaking for minimal bundle size
- Image optimization and lazy loading
- Service worker for offline functionality

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Options

1. **Vercel** (Recommended)

   ```bash
   npm run build
   # Deploy to Vercel
   ```

2. **Netlify**

   ```bash
   npm run build
   # Deploy dist/ folder
   ```

3. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 8080
   CMD ["npm", "run", "preview"]
   ```

## 🔒 Security

- Environment variables for sensitive data
- Input validation with Zod schemas
- HTTPS enforcement
- Content Security Policy headers
- Regular dependency updates

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Bundle Size**: <500KB initial, <2MB total
- **Load Time**: <3s on 3G networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and ensure tests pass: `npm run check-all`
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Test coverage >80%

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.com/) for backend services

## 📞 Support

For support and questions:

- Create an [issue](https://github.com/nicholsmindset/halal-sg-connect/issues)
- Check the [documentation](https://github.com/nicholsmindset/halal-sg-connect/wiki)

---

Made with ❤️ for the Singapore Muslim community
