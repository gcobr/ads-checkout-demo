const express = require('express');

const defaultPort = 3000;
const app = express();

const port = process.env['PORT'] || defaultPort;

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(3000, () =>
    console.log(`Listening on port ${port}`)
);