const {database} = require('./database');
const {discounts} = require('./discounts');

const guestCustomerName = 'Guest';

function normalise(shoppingCart) {
    const quantities = shoppingCart.items.reduce((items, item) => {
        items[item.productId] = items[item.productId] + item.quantity || item.quantity;
        return items;
    }, {});
    const normalisedItems = Object.keys(quantities).reduce((items, productId) => {
        items.push({
            productId: parseInt(productId),
            quantity: quantities[productId]
        });
        return items;
    }, []);
    return {
        customerId: shoppingCart.customerId,
        items: normalisedItems
    };
}

function calculate(shoppingCart) {
    let identifiedCustomer;
    if (shoppingCart.customerId) {
        identifiedCustomer = database.findCustomer(shoppingCart.customerId);
    }
    let calculatedItems = shoppingCart.items.map(item => {
        let price;
        if (identifiedCustomer) {
            price = database.findPriceForCustomer(shoppingCart.customerId, item.productId);
        } else {
            price = database.findPrice(item.productId);
        }
        if (price) {
            return {
                productId: item.productId,
                name: price.name,
                quantity: item.quantity,
                unitPrice: price.price,
                totalItemPrice: item.quantity * price.price
            }
        }
    });
    calculatedItems = calculatedItems.filter(item => !!item);
    const customerName = identifiedCustomer ? identifiedCustomer.name : guestCustomerName;
    const order = {
        customerName: customerName,
        items: calculatedItems
    };
    if (identifiedCustomer) {
        const pricingPolicies = database.findPricingPoliciesForCustomer(identifiedCustomer.id);
        if (pricingPolicies) {
            const applicablePolicies = pricingPolicies.map(policy => discounts.forPricingPolicy(policy));
            if (applicablePolicies) {
                applicablePolicies.forEach(policy => policy(order));
            }
        }
    }
    order.orderTotal = order.items.reduce((total, item) => total += item.totalItemPrice, 0.0);
    return order
}

function validItem(item) {
    return Number.isInteger(item.productId)
        && Number.isInteger(item.quantity)
        && item.quantity > 0;
}

function valid(cart) {
    if (!cart.items || cart.items.length < 1) {
        return false;
    }
    for (let item of cart.items) {
        if (!validItem(item)) {
            return false;
        }
    }
    return !(cart.customerId && !Number.isInteger(cart.customerId));

}

module.exports = {
    shoppingCart: {
        normalise,
        calculate,
        valid
    }
}
