/*
 * In a real-world implementation, the data
 * below would come from an external database.
 * We are hard-coding it here for the sake of simplicity.
 */

// Other kinds could be added in the future
const policyTypes = {
    freeItem: 'FreeItem'
}

let defaultPriceList, customPriceList, customers, policies;

function reset() {
    defaultPriceList = [];
    customPriceList = [];
    customers = [];
    policies = [];
}

reset();

function newFreeItemPolicy(id, customerId, productId, minQuantity) {
    return {
        id: id,
        customerId: customerId,
        productId: productId,
        type: policyTypes.freeItem,
        minQuantity: minQuantity
    };
}


function findPrice(productId) {
    return defaultPriceList.find(defaultPrice => defaultPrice.id === productId);
}

function findCustomer(customerId) {
    return customers.find(customer => customer.id === customerId);
}

function findPriceForCustomer(customerId, productId) {
    const defaultPrice = findPrice(productId);
    const customPrice = customPriceList.find(customPrice =>
        customPrice.customerId === customerId &&
        customPrice.productId === defaultPrice.id);
    if (customPrice) {
        return {
            id: defaultPrice.productId,
            name: defaultPrice.name,
            price: customPrice.price
        };
    }
    return defaultPrice;
}

function findPricingPoliciesForCustomer(customerId) {
    return policies.filter(policy => policy.customerId === customerId);
}

function addPrice(id, name, price) {
    defaultPriceList.push({
        id: id,
        name: name,
        price: price
    });
}

function addCustomPrice(id, customerId, productId, price) {
    customPriceList.push({
        id: id,
        customerId: customerId,
        productId: productId,
        price: price
    });
}

function addCustomer(id, name) {
    customers.push({
        id: id,
        name: name
    });
}

function addFreeItemPolicy(id, customerId, productId, minQuantity) {
    policies.push(newFreeItemPolicy(id, customerId, productId, minQuantity));
}

module.exports = {
    database: {
        findPriceForCustomer,
        findPrice,
        findCustomer,
        findPricingPoliciesForCustomer,
        addCustomer,
        addPrice,
        addCustomPrice,
        addFreeItemPolicy,
        reset
    }
}
