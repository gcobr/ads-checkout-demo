const express = require('express');
const bodyParser = require('body-parser');
const defaultPort = 3000;
const app = express();
app.use(bodyParser.json());

const {shoppingCart} = require('./app/shoppingCart');

// This initialises a fake in-memory database
const initialData = require('./tests/initialData');
const {database} = require('./app/database');
initialData.initialiseDatabase(database);

const port = parseInt(process.env['PORT']) || defaultPort;

app.get('/', (req, res) => {
    res.send('Please refer to: https://github.com/gcobr/ads-checkout-demo');
});

app.post('/cart', (req, res) => {
    const cart = req.body;
    if (!shoppingCart.valid(cart)) {
        res.sendStatus(400);
    } else {
        const normalised = shoppingCart.normalise(cart);
        const calculated = shoppingCart.calculate(normalised);
        res.send(calculated);
    }
});

app.get('/prices', (req, res) => {
    res.send(database.listPrices());
});

app.get('/customers', (req, res) => {
    res.send(database.listCustomers());
});


app.listen(port, () =>
    console.log(`Listening on port ${port}`)
);
