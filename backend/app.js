import express from 'express';
import cors from 'cors';
import productsRouter from './routers/products.routes.js';
import userRouter from './routers/user.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyToken, checkIfValidToken } from './middleware/auth.middleware.js';
import cookieParser from 'cookie-parser';
import checkRole from './middleware/role.permission.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Serve static frontend assets (css/js/images)
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Serve html 
app.get('/',checkIfValidToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Protected routes
app.get('/addproduct',verifyToken,checkRole(["admin"]), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/addproduct.html'));
});
app.get('/product',verifyToken,checkRole(["admin","customer"]), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/product.html'));
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/user', userRouter);


export default app;
