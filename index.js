const express = require('express');

const defaultPort = 3000;
const app = express();

const port = parseInt(process.env['PORT']) || defaultPort;

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () =>
    console.log(`Listening on port ${port}`)
);