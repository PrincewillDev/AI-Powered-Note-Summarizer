# AI-Powered Note Summarizer - Frontend

A modern React + TypeScript frontend for the AI-Powered Note Summarizer application.

## Features

- ✨ **Clean, Modern UI** - Built with React and Tailwind CSS
- 🤖 **AI Integration** - Seamless connection to Groq-powered backend
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Built with Vite for optimal speed
- 🔄 **Real-time Feedback** - Loading states and error handling
- 🎨 **Beautiful Design** - Professional gradient backgrounds and animations

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling
- **Vercel** - Deployment platform

## Quick Start

### Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your backend URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── index.css        # Global styles with Tailwind
└── vite-env.d.ts    # TypeScript environment types
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy automatically

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

## API Integration

The frontend connects to the backend API at `/summarize` endpoint:

```typescript
const response = await fetch(`${API_BASE_URL}/summarize`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: notes }),
})
```

## UI Components

### Main Features

- **Text Input Area** - Large textarea for note input
- **Summarize Button** - Triggers AI summarization with loading state
- **Clear Button** - Resets form state
- **Summary Display** - Shows formatted AI-generated summary
- **Error Messages** - User-friendly error handling

### Design System

- **Colors**: Blue primary, gray neutrals, green/red for status
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind utilities
- **Animations**: Subtle loading spinners and transitions

## Performance

- ⚡ **Vite** - Lightning-fast development and builds
- 📦 **Tree Shaking** - Only includes used code
- 🗜️ **Asset Optimization** - Automatic image and CSS optimization
- 🌐 **CDN Delivery** - Global content delivery via Vercel

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- 📱 Mobile browsers

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- **ESLint** - Code linting and formatting
- **TypeScript** - Type checking
- **Prettier** - Code formatting (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
