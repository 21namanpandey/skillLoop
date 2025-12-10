
## 📁 **Frontend Readme**

# SkillLoop Frontend

## 🎨 Overview
SkillLoop Frontend is a React-based web application that provides a seamless interface for decentralized skill exchange. It features a modern, responsive design with full blockchain integration.

## ✨ Features
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ User authentication and profile management
- ✅ Service browsing and requesting
- ✅ Session management with blockchain verification
- ✅ Real-time notifications
- ✅ Reputation system visualization
- ✅ Dispute resolution interface
- ✅ Mobile-friendly design

## 🏗️ Architecture
```
Frontend Architecture:
├── Component Layer (React Components)
├── State Layer (Context API + Hooks)
├── API Layer (Axios Client)
├── UI Layer (Tailwind CSS)
└── Blockchain Layer (MetaMask + ethers.js)
```

## 🛠️ Tech Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.5.0
- **Styling**: Tailwind CSS 3.3.0
- **Routing**: React Router 6.20.0
- **State Management**: Context API + Hooks
- **HTTP Client**: Axios 1.6.0
- **Icons**: React Icons 4.11.0
- **Notifications**: React Hot Toast 2.4.1
- **Forms**: React Hook Form 7.48.2
- **Validation**: Zod 3.22.4

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- Git
- Modern web browser
- MetaMask extension (recommended)

### Steps
1. Clone the repository:
```bash
git clone https://github.com/skillloop/frontend.git
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

4. Start development server:
```bash
npm run dev
```

5. Open in browser:
```
http://localhost:5173
```

## ⚙️ Environment Variables
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Blockchain Configuration
VITE_NETWORK=sepolia  # or 'mock' for development
VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
VITE_CONTRACT_ADDRESS=0x507270E959e37Cc3366ec064D96E887b5BcA3d87

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 📁 Project Structure
```
src/
├── api/                    # API configuration
│   └── axiosClient.js     # Axios instance
├── components/            # Reusable components
│   ├── common/           # Shared components
│   └── layout/           # Layout components
├── context/              # React Context
│   └── AuthContext.js    # Authentication context
├── pages/                # Page components
│   ├── Landing.js        # Landing page
│   ├── Login.js          # Login page
│   ├── Dashboard.js      # Dashboard
│   └── ...               # Other pages
├── assets/               # Static assets
│   ├── images/           # Images
│   └── styles/           # CSS files
├── utils/                # Utility functions
│   └── helpers.js        # Helper functions
├── App.js                # Main App component
└── main.js               # Entry point
```

## 🎭 Component Library

### Core Components
1. **ServiceCard** - Service listing display
2. **SessionCard** - Session overview with status
3. **RequestCard** - Service request management
4. **ReputationBadge** - Visual reputation display
5. **NetworkAlert** - Blockchain network detection

### Modal Components
1. **DisputeModal** - Multi-step dispute creation
2. **ReviewModal** - 5-star rating with tags
3. **ToastContainer** - Global notifications

### Layout Components
1. **Navbar** - Responsive navigation
2. **Sidebar** - User menu (planned)
3. **Footer** - Page footer (planned)

## 📱 Pages

### Public Pages
1. **Landing** (`/`) - Marketing/landing page
2. **Login** (`/login`) - User login
3. **Register** (`/register`) - User registration

### Protected Pages
1. **Dashboard** (`/dashboard`) - User dashboard with stats
2. **Profile** (`/profile`) - Profile management
3. **BrowseServices** (`/browse`) - Service discovery
4. **Requests** (`/requests`) - Request management
5. **Sessions** (`/sessions`) - Session listing
6. **SessionDetail** (`/sessions/:id`) - Detailed session view
7. **BlockchainStats** (`/blockchain-stats`) - Blockchain analytics
8. **Reviews** (`/reviews`) - Review management
9. **Disputes** (`/disputes`) - Dispute listing
10. **DisputeDetail** (`/disputes/:id`) - Detailed dispute view
11. **LocalExplorer** (`/local-explorer`) - Mock blockchain explorer

## 🔗 API Integration

### Axios Configuration
```javascript
// Features:
• Base URL configuration
• Automatic JWT token injection
• Response/request interceptors
• Consistent error handling
• Auto-logout on 401 errors
```

### API Methods
```javascript
// Authentication
login(email, password)
register(name, email, password)
logout()

// User Management
getCurrentUser()
updateProfile(data)
getUserServices(filters)

// Session Management
getSessions()
createSession(data)
confirmSession(sessionId)

// Blockchain
getBlockchainStats()
getTransactionStatus(txHash)
```

## 🎨 Styling System

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        skill: {
          blue: '#3b82f6',
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }
    }
  }
}
```

### Component Styling Patterns
```javascript
// Card Component
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-card p-6 ${className}`}>
    {children}
  </div>
);

// Badge Component
const Badge = ({ variant = 'default', children }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${variants[variant]}`}>
      {children}
    </span>
  );
};
```

## 🔗 Blockchain Integration

### MetaMask Integration
```javascript
// Network Detection
const checkNetwork = async () => {
  if (window.ethereum) {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === '0xaa36a7'; // Sepolia
  }
  return false;
};

// Network Switching
const switchToSepolia = async () => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }],
  });
};
```

### Blockchain Components
1. **BlockchainStats** - Shows blockchain statistics
2. **NetworkAlert** - Alerts for wrong network
3. **TransactionStatus** - Shows transaction status

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind defaults */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
```

### Mobile-First Examples
```javascript
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive columns */}
</div>

// Responsive Navigation
<nav className="flex flex-col md:flex-row">
  {/* Stack on mobile, row on desktop */}
</nav>
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Component tests
npm run test:components

# E2E tests (planned)
npm run test:e2e
```

### Test Examples
```javascript
// Component Test
test('ServiceCard renders service information', () => {
  render(<ServiceCard service={mockService} />);
  expect(screen.getByText('Website Design')).toBeInTheDocument();
});

// Integration Test
test('Login form submits correctly', async () => {
  render(<Login />);
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.click(screen.getByText(/sign in/i));
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalled();
  });
});
```

## 🚢 Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:5173
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Static Hosting
```bash
# Build
npm run build

# Deploy to any static host
# Copy dist/ folder to your hosting provider
```

## 📊 Performance Optimization

### Code Splitting
```javascript
// Lazy loading routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
```

### Image Optimization
```javascript
<img
  src={imageUrl}
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze
```

## 🔒 Security

### Implemented
- Protected routes with authentication
- Input validation on forms
- Secure API communication
- JWT token management

### Best Practices
- Never store secrets in client code
- Use environment variables for configuration
- Validate all user inputs
- Sanitize displayed content

## 📱 Mobile Experience

### Touch-Friendly Design
```javascript
// Minimum touch target size
<button className="min-h-11 min-w-11 px-4 py-2">
  Action
</button>

// Touch-friendly inputs
<input className="h-12 px-4 text-lg" />
```

### Mobile-Specific Features
- Hamburger menu for mobile navigation
- Touch-optimized buttons and forms
- Responsive data tables
- Mobile-friendly modals

## ♿ Accessibility

### ARIA Labels
```javascript
<button aria-label="Close modal" onClick={onClose}>
  <FaTimes />
</button>
```

### Keyboard Navigation
- Focus management in modals
- Keyboard shortcuts (planned)
- Skip navigation links (planned)

### Color Contrast
- WCAG AA compliant colors
- High contrast mode support
- Color blindness considerations

## 🛠️ Development

### Development Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Code Quality
- ESLint configuration for code standards
- Prettier for code formatting
- Husky for pre-commit hooks
- Comprehensive comments and documentation

## 🔧 Troubleshooting

### Common Issues

1. **API Connection Failed**
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check environment variables
echo $VITE_API_URL
```

2. **MetaMask Not Detected**
```bash
# Ensure MetaMask is installed
# Check if window.ethereum exists
console.log(window.ethereum)
```

3. **Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
```

### Debug Mode
```bash
# Enable React DevTools
npm install -g react-devtools

# Check browser console for errors
F12 → Console
```

## 📚 Documentation

### Component Documentation
```bash
# Generate component docs (planned)
npm run docs:components
```

### Storybook (Planned)
```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards
- Follow existing code style
- Write comprehensive tests
- Update documentation
- Use meaningful commit messages

## 📞 Support

### Resources
- [Component Documentation](./docs/components.md)
- [API Integration Guide](./docs/api-guide.md)
- [Deployment Guide](./docs/deployment.md)

### Issues
- Report bugs: [GitHub Issues](https://github.com/skillloop/frontend/issues)
- Feature requests: [GitHub Discussions](https://github.com/skillloop/frontend/discussions)
- Questions: [GitHub Discussions](https://github.com/skillloop/frontend/discussions)

## 📄 License
MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Vite team for the fast build tool
- All contributors and testers

---

**Frontend Version**: 1.0.0  
**React**: 18.2.0  
**Vite**: 4.5.0  
**Status**: Production Ready  
**Browser Support**: Chrome, Firefox, Safari, Edge  

---