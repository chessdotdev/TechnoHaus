import express from 'express'
import cors from 'cors'
import productsRouter from './routers/products.routes.js'
const app = express();

app.use(express.json())
app.use(cors());

app.use('/api/products', productsRouter)

export default app;