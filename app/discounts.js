const noChange = (cart) => cart;

function freeItemPolicy(productId, minQuantity) {
    return function (order) {
        const eligibleItem = order.items.find(item => item.productId === productId);
        if (eligibleItem) {
            const freeItemCount = Math.floor(eligibleItem.quantity / minQuantity);
            const newQuantity = eligibleItem.quantity - freeItemCount;
            eligibleItem.totalItemPrice = Number((newQuantity * eligibleItem.unitPrice).toFixed(2));
        }
    }
}


function forPricingPolicy(policy) {
    switch (policy.type) {
        case 'FreeItem':
            return freeItemPolicy(policy.productId, policy.minQuantity);
        default:
            return noChange
    }
}

module.exports = {
    discounts: {
        forPricingPolicy
    }
}
