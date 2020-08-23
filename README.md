# ads-checkout-demo

API documentation
This API is documented with Swagger.

Live documentation: [ads-checkout-demo.herokuapp.com](https://ads-checkout-demo.herokuapp.com/).

## Continuous integration and deployment

This API automatically deployed to Heroku every time code is pushed to the master branch of this repository. This workflow is enabled by GitHub Actions. See the configuration file in [.github/workflows](./.github/workflows).

## Development

### Build the image locally

~~~
$ docker build . -t ads-checkout-demo
~~~

### Create a container from the image and run it

~~~
$ docker run --rm --name ads-checkout-demo -p 3000:3000 ads-checkout-demo
Listening on port 3000
~~~

