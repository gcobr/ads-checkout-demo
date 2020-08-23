const { shoppingCart } = require('./shoppingCart');

function calculateShoppingCart(cart) {
    const normalisedCart = shoppingCart.normalise(cart);
    const calculatedCart = shoppingCart.calculate(normalisedCart);
    return shoppingCart.applyDiscounts(calculatedCart);
}

module.exports = {
    api: {
       calculateShoppingCart
    }
}
