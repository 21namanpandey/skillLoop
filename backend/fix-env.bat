# Terminal 1: Start Hardhat blockchain
cd backend
npx hardhat node

# Terminal 2: Update .env and deploy
cd backend

# Update .env
echo PORT=5000 > .env
echo MONGODB_URI=mongodb+srv://2492004namanpandey:21namanpandey@cluster0.8tgtzvl.mongodb.net/skillloop?retryWrites=true\&w=majority >> .env
echo JWT_SECRET=skillloop_jwt_secret_key_2024_change_this_later >> .env
echo RPC_URL=http://127.0.0.1:8545 >> .env
echo PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 >> .env
echo CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3 >> .env

# Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Start backend
npm run dev