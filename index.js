const express = require('express');
const bodyParser = require('body-parser');
const defaultPort = 3000;
const app = express();

const {shoppingCart} = require('./app/shoppingCart');

app.use(bodyParser.json());

const port = parseInt(process.env['PORT']) || defaultPort;

app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/cart', (req, res) => {
    const cart = req.body;
    if (!shoppingCart.valid(cart)) {
        res.status(400);
    } else {
        const normalised = shoppingCart.normalise(cart);
        const calculated = shoppingCart.calculate(normalised);
        res.send(calculated);
    }
});


app.listen(port, () =>
    console.log(`Listening on port ${port}`)
);
