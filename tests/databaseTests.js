const {describe, it, expect, beforeAll, afterAll} = require('@jest/globals');
const {database} = require('../app/database');
const mockData = require('../tests/initialData');

describe('Database', () => {

    // Load mock data into database
    beforeAll(() => {
        mockData.initialiseDatabase(database);
    });

    afterAll(() => {
        database.reset();
    })

    it('should find default prices', () => {
        expect(database.findPrice(mockData.adIds.classic).price).toEqual(269.99);
        expect(database.findPrice(mockData.adIds.standout).price).toEqual(322.99);
        expect(database.findPrice(mockData.adIds.premium).price).toEqual(394.99);
    });

    it('should find MYERs prices', () => {
        expect(database.findPriceForCustomer(mockData.customerIds.myer, mockData.adIds.classic).price).toEqual(269.99);
        expect(database.findPriceForCustomer(mockData.customerIds.myer, mockData.adIds.standout).price).toEqual(322.99);
        expect(database.findPriceForCustomer(mockData.customerIds.myer, mockData.adIds.premium).price).toEqual(389.99);
    });

});
