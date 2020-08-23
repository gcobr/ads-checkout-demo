const customerIds = {
    secondBite: 85,
    axil: 86,
    myer: 87,
    davidJones: 90
}

const adIds = {
    classic: 21,
    standout: 22,
    premium: 23
}

function initialiseDatabase(database) {
    database.addCustomer(customerIds.secondBite, 'SecondBite');
    database.addCustomer(customerIds.axil, 'Axil Coffee Roasters');
    database.addCustomer(customerIds.myer, 'MYER');
    database.addCustomer(customerIds.davidJones, 'David Jones');
    database.addPrice(adIds.classic, 'Classic Ad', 269.99);
    database.addPrice(adIds.standout, 'Stand out Ad', 322.99);
    database.addPrice(adIds.premium, 'Premium Ad', 394.99);
    database.addCustomPrice(1, customerIds.axil, adIds.standout, 299.99);
    database.addCustomPrice(2, customerIds.myer, adIds.premium, 389.99);
    database.addFreeItemPolicy(1, customerIds.secondBite, adIds.classic, 3);
    database.addFreeItemPolicy(2, customerIds.myer, adIds.standout, 5);
    database.addPercentageOfItemsPolicy(3, customerIds.davidJones, 10);
}

module.exports = {
    initialiseDatabase,
    adIds,
    customerIds
}
