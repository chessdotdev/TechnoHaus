import express from 'express'
import cors from 'cors'
import productsRouter from './routers/products.routes.js'
import userRouter from './routers/user.route.js'
const app = express();

app.use(express.json())
app.use(cors());

app.use('/api/products', productsRouter)
app.use('/api/user', userRouter)

export default app;