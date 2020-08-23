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

function percentageOfItems(percentage) {
    return function (order) {
        order.items.forEach(item => {
            const newUnitPrice = item.unitPrice - (item.unitPrice * percentage / 100);
            item.unitPrice = Number(newUnitPrice.toFixed(2));
            item.totalItemPrice = item.unitPrice * item.quantity;
        });
    }
}

function forPricingPolicy(policy) {
    switch (policy.type) {
        case 'FreeItem':
            return freeItemPolicy(policy.productId, policy.minQuantity);
        case 'PercentageOfItems':
            return percentageOfItems(policy.percentage);
        default:
            return noChange
    }
}

module.exports = {
    discounts: {
        forPricingPolicy
    }
}
