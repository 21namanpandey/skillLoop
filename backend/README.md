# **SkillLoop: Decentralized Skill Exchange Platform**

## **Complete Platform Documentation**

## 📁 **Backend Readme**

# SkillLoop Backend

## 🚀 Overview
SkillLoop Backend is an Express.js API server that powers the decentralized skill exchange platform. It integrates MongoDB for data storage and Ethereum blockchain for verifiable service logging.

## 📋 Features
- ✅ User authentication with JWT
- ✅ Session management with blockchain verification
- ✅ Reputation system with points and badges
- ✅ Dispute resolution mechanism
- ✅ Dual-mode blockchain (Real Sepolia/Mock)
- ✅ Comprehensive API documentation

## 🏗️ Architecture
```
Backend Architecture:
├── API Layer (Express.js)
├── Data Layer (MongoDB + Mongoose)
├── Blockchain Layer (ethers.js + Smart Contracts)
└── Service Layer (Business Logic)
```

## 🛠️ Tech Stack
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB 6.0+ with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Blockchain**: ethers.js 6.10.0, Hardhat
- **Validation**: Built-in + Mongoose validation
- **Environment**: dotenv, CORS, Morgan

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- MongoDB 6.0+
- Git
- MetaMask (for blockchain testing)

### Steps
1. Clone the repository:
```bash
git clone https://github.com/skillloop/backend.git
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## ⚙️ Environment Variables
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/skillloop

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Blockchain (Optional - for Sepolia)
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
PRIVATE_KEY=0xyour_private_key_here
CONTRACT_ADDRESS=0x507270E959e37Cc3366ec064D96E887b5BcA3d87
ETHERSCAN_API_KEY=your_etherscan_key
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/services` - Browse services
- `GET /api/users/all` - Get all users

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/my` - Get user sessions
- `GET /api/sessions/:id` - Get session by ID
- `PUT /api/sessions/:id/confirm` - Confirm session

### Requests
- `POST /api/requests` - Create service request
- `GET /api/requests/incoming` - Get incoming requests
- `GET /api/requests/outgoing` - Get outgoing requests
- `PUT /api/requests/:id/status` - Update request status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/my` - Get my reviews
- `GET /api/reviews/reputation/:userId` - Get reputation

### Disputes
- `POST /api/disputes` - Create dispute
- `GET /api/disputes/my` - Get my disputes
- `GET /api/disputes/:id` - Get dispute by ID

### Blockchain
- `GET /api/blockchain/status` - Blockchain status
- `GET /api/blockchain/transaction/:txHash` - Transaction status
- `GET /api/blockchain/balance/:address` - Check balance
- `GET /api/blockchain/local-transactions` - Mock transactions

## 🗄️ Database Models

### 1. User Model
```javascript
{
  name, email, passwordHash,
  bio, location, walletAddress,
  skillsOffer[], skillsNeed[],
  totalHoursProvided, totalSessions, rating
}
```

### 2. Session Model
```javascript
{
  providerId, clientId,
  serviceName, category, description,
  status, providerConfirmed, clientConfirmed,
  onChainTxHash, blockchainNetwork, onChainSessionId
}
```

### 3. Review Model
```javascript
{
  sessionId, reviewerId, reviewedId,
  rating, comment, tags[], isVerified
}
```

### 4. Dispute Model
```javascript
{
  sessionId, raisedBy, against,
  reason, description, evidence[],
  status, resolution
}
```

### 5. Reputation Model
```javascript
{
  userId, points, level,
  badges[], weeklyStats, monthlyStats
}
```

## 🔗 Blockchain Integration

### Smart Contract
- **Contract**: `ServiceSessionLedger.sol`
- **Address**: `0x507270E959e37Cc3366ec064D96E887b5BcA3d87`
- **Network**: Sepolia Testnet

### Dual Mode Operation
1. **Mock Mode** (Default)
   - No real blockchain needed
   - Simulated transactions in MongoDB
   - Instant confirmation

2. **Real Mode** (Sepolia)
   - Real ETH required for gas
   - Actual smart contract calls
   - ~15-30 second confirmation

### Switching Modes
```env
# For Real Mode (Sepolia):
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
PRIVATE_KEY=0xyour_private_key
CONTRACT_ADDRESS=0x507270E959e37Cc3366ec064D96E887b5BcA3d87

# For Mock Mode (Development):
# Leave above variables empty
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# All tests
npm run test:all
```

### Test Coverage
```bash
npm run test:coverage
```

## 🚢 Deployment

### Local Deployment
```bash
npm start
# Server runs on http://localhost:5000
```

### Production Deployment
1. Build for production:
```bash
npm run build
```

2. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name skillloop-backend
```

### Docker Deployment
```bash
docker build -t skillloop-backend .
docker run -p 5000:5000 skillloop-backend
```

## 📊 Monitoring

### Health Check
```bash
GET /api/health
```

### Logs
- Development: Console output with Morgan
- Production: Winston logging (planned)

## 🔒 Security

### Implemented
- JWT authentication
- Password hashing with bcrypt
- Input validation
- CORS configuration
- Rate limiting (basic)

### Planned
- Helmet.js for security headers
- Rate limiting with Redis
- SQL injection protection
- XSS protection

## 📈 Performance

### Optimization
- Database indexing
- Query optimization
- Response compression
- Caching layer (planned)

### Monitoring
- Response time tracking
- Error rate monitoring
- Database performance
- Memory usage

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Style
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Comprehensive comments

## 📚 Documentation

### API Documentation
```bash
# Generate API docs (planned)
npm run docs:generate
```

### Database Schema
- See `/docs/schema.md` for full schema documentation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
```bash
# Check if MongoDB is running
sudo service mongod status

# Check connection string
echo $MONGODB_URI
```

2. **JWT Authentication Issues**
```bash
# Check JWT secret
echo $JWT_SECRET

# Clear browser localStorage
localStorage.clear()
```

3. **Blockchain Transactions Failing**
```bash
# Check Sepolia ETH balance
node scripts/check-balance.js

# Verify contract address
echo $CONTRACT_ADDRESS
```

### Debug Mode
```bash
DEBUG=skillloop:* npm run dev
```

## 📞 Support

### Resources
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/schema.md)
- [Deployment Guide](./docs/deployment.md)

### Issues
- Report bugs: [GitHub Issues](https://github.com/skillloop/backend/issues)
- Feature requests: [GitHub Discussions](https://github.com/skillloop/backend/discussions)

## 📄 License
MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments
- Ethereum Foundation for blockchain technology
- MongoDB for database solution
- Express.js team for the framework
- All contributors and testers

---

**Backend Version**: 1.0.0  
**Node.js**: 18.x+  
**MongoDB**: 6.0+  
**Status**: Production Ready  
**Maintenance**: Active  

---