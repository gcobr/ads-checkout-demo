# Ads shopping cart checkout

Live endpoint: [ads-checkout-demo.herokuapp.com](https://ads-checkout-demo.herokuapp.com/).

See [API Usage](#api-usage) below.

## Continuous integration and deployment

This API automatically deployed to Heroku every time code is pushed to the master branch of this repository. This workflow is enabled by GitHub Actions. See the configuration file in [.github/workflows](./.github/workflows).

## Development

### Run tests locally

Install dependencies:
~~~
$ npm install
~~~

Run the tests:
~~~
$ npm test

> ads-checkout-demo@1.0.0 test /Users/user/GitHub/ads-checkout-demo
> jest ./tests

 PASS  tests/shoppingCartTests.js
 PASS  tests/databaseTests.js

Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        0.628 s, estimated 1 s
~~~

### Build the image locally

~~~
$ docker build . -t ads-checkout-demo
~~~

### Create a container from the image and run it

~~~
$ docker run --rm --name ads-checkout-demo -p 3000:3000 ads-checkout-demo
Listening on port 3000
~~~

## API usage

The examples below use `curl` and [jq](https://stedolan.github.io/jq/).

### See the price list

~~~
$ curl https://ads-checkout-demo.herokuapp.com/prices | jq
~~~

### Find the identifiers of our customers
~~~
$ curl https://ads-checkout-demo.herokuapp.com/customers | jq
~~~

### Submit a shopping cart for calculation and see the result

#### For an unidentified customer (guest)

Request:
~~~
curl --location --request POST 'https://ads-checkout-demo.herokuapp.com/cart' \
--header 'Content-Type: application/json' \
--data-raw '{
    "items": [
        {"productId": 21, "quantity": 2},
        {"productId": 22, "quantity": 1},
        {"productId": 23, "quantity": 1}
    ]
}' | jq
~~~

Response:
~~~
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   423  100   274  100   149  13700   7450 --:--:-- --:--:-- --:--:-- 21150
{
  "customerName": "Guest",
  "items": [
    {
      "productId": 21,
      "name": "Classic Ad",
      "quantity": 2,
      "unitPrice": 269.99,
      "totalItemPrice": 539.98
    },
    {
      "productId": 22,
      "name": "Stand out Ad",
      "quantity": 1,
      "unitPrice": 322.99,
      "totalItemPrice": 322.99
    },
    {
      "productId": 23,
      "name": "Premium Ad",
      "quantity": 1,
      "unitPrice": 394.99,
      "totalItemPrice": 394.99
    }
  ],
  "orderTotal": 1257.96
}
~~~

#### For a known customer with special pricing

Request:
~~~
curl --location --request POST 'https://ads-checkout-demo.herokuapp.com/cart' \
--header 'Content-Type: application/json' \
--data-raw '{
  "customerId": 87,
  "items": [
    {
      "productId": 22,
      "quantity": 7
    },
    {
      "productId": 21,
      "quantity": 1
    },
    {
      "productId": 23,
      "quantity": 1
    }
  ]
}' | jq
~~~

Response:
~~~
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   543  100   336  100   207   164k   101k --:--:-- --:--:-- --:--:--  265k
{
  "customerName": "MYER",
  "items": [
    {
      "productId": 21,
      "name": "Classic Ad",
      "quantity": 1,
      "unitPrice": 269.99,
      "totalItemPrice": 269.99
    },
    {
      "productId": 22,
      "name": "Stand out Ad",
      "quantity": 7,
      "unitPrice": 322.99,
      "totalItemPrice": 1937.94
    },
    {
      "productId": 23,
      "name": "Premium Ad",
      "quantity": 1,
      "unitPrice": 389.99,
      "totalItemPrice": 389.99
    }
  ],
  "orderTotal": 2597.92
}
~~~

## Extensibility

### New price overrides for other customers

Simply add it to the database:

~~~javascript
const {database} = require('./app/database');

// New customer: ANZ Bank
database.addCustomer(100, 'ANZ Bank');
// Stand out Ad (id: 22) goes for $200.00 to ANZ
database.addCustomPrice(100, 22, 200);
~~~

### New free item rule

Simply add it to the database:

~~~javascript
const {database} = require('./app/database');

// New customer: NAB Bank
database.addCustomer(105, 'NAB Bank');
// NAB now gets 1 free Stand out Ad (id: 22) for every 4 they purchase
database.addFreeItemPolicy(105, 22, 4);
~~~
