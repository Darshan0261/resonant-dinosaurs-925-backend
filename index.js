const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const { connection } = require('./configs/db.js');

const { userRouter } = require('./routes/users.router.js')
const { adminRouter } = require('./routes/admin.router.js')
const { cartRouter } = require('./routes/cart.router');
const { addressRouter } = require('./routes/address.router.js');
const { productRouter } = require('./routes/product.router.js');
const { ordersRouter } = require('./routes/orders.router')

require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}))
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Basic API Endpoint')
});

app.use("/products", productRouter)
app.use('/users', userRouter)
app.use('/admin', adminRouter)
app.use('/cart', cartRouter)
app.use('/address', addressRouter)
app.use('/orders', ordersRouter)

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
        console.log('Cannot connect to DB')
    }
    console.log(`Server is running on port ${process.env.port}`)
})