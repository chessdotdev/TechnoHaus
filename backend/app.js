import express from 'express';
import cors from 'cors';
import productsRouter from './routers/products.routes.js';
import userRouter from './routers/user.route.js';
import cartRouter from './routers/cart.route.js';
import profileRouter from './routers/profile.route.js';
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

const noCache = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};

//Protected routes
app.get('/', noCache, checkIfValidToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.get('/addproduct', noCache, verifyToken, checkRole(["admin"]), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/addproduct.html'));
});
app.get('/product', noCache, verifyToken, checkRole(["admin","customer"]), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/product.html'));
});
app.get('/pcbuilder', noCache, verifyToken, checkRole(["admin","customer"]), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/pcbuilder.html'));
});
app.get('/cart', noCache, verifyToken, checkRole(["admin","customer"]), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/cart.html'));
});
app.get('/profile', noCache, verifyToken, checkRole(["admin","customer"]), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/profile.html'));
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/user', userRouter);
app.use('/api/cart',verifyToken, cartRouter)
app.use('/api/profile', verifyToken, profileRouter);

export default app;
