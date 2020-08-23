const {describe, it, expect, beforeAll} = require('@jest/globals');
const {shoppingCart} = require('../app/shoppingCart');
const {database} = require('../app/database');
const mockData = require('../tests/initialData');

describe('Shopping Cart', () => {

    it('should be normalised', () => {
        const normalised = shoppingCart.normalise({
            customerId: 99,
            items: [
                {productId: 65, quantity: 1},
                {productId: 33, quantity: 1},
                {productId: 65, quantity: 1},
                {productId: 33, quantity: 4},
                {productId: 72, quantity: 8}
            ]
        });
        expect(normalised.customerId).toEqual(99);
        expect(normalised.items).toContainEqual({productId: 65, quantity: 2});
        expect(normalised.items).toContainEqual({productId: 33, quantity: 5});
        expect(normalised.items).toContainEqual({productId: 72, quantity: 8});
    });

    it('should validate', () => {
       expect(shoppingCart.valid({
           items: [
               {productId: 65, quantity: 1},
               {productId: 33, quantity: 1},
               {productId: 65, quantity: 2}
           ]
       })).toBe(true);
    });

    it('should not validate with invalid customerId', () => {
        expect(shoppingCart.valid({
            customerId: 'ANZ',
            items: [
                {productId: 65, quantity: 1}
            ]
        })).toBe(false);
        expect(shoppingCart.valid({
            customerId: 22.11,
            items: [
                {productId: 65, quantity: 1}
            ]
        })).toBe(false);
    });

    it('should not validate with non-int Id', () => {
        expect(shoppingCart.valid({
            items: [
                {productId: '65', quantity: 1},
                {productId: 33, quantity: 1},
                {productId: 65, quantity: 2}
            ]
        })).toBe(false);
        expect(shoppingCart.valid({
            items: [
                {productId: 65, quantity: 1},
                {productId: 33.5, quantity: 1},
                {productId: 65, quantity: 2}
            ]
        })).toBe(false);
    });

    it('should not validate without items', () => {
        expect(shoppingCart.valid({
            items: []
        })).toBe(false);
        expect(shoppingCart.valid({
            customerId: 123
        })).toBe(false);
    });

    it('should not validate with non-int quantity', () => {
        expect(shoppingCart.valid({
            items: [
                {productId: 65, quantity: '1'},
                {productId: 33, quantity: 1},
                {productId: 65, quantity: 2}
            ]
        })).toBe(false);
        expect(shoppingCart.valid({
            items: [
                {productId: 65, quantity: 1},
                {productId: 33, quantity: 1.5},
                {productId: 65, quantity: 2}
            ]
        })).toBe(false);
    });

    it('should not validate with zero quantity', () => {
        expect(shoppingCart.valid({
            items: [
                {productId: 65, quantity: 1},
                {productId: 33, quantity: 1},
                {productId: 65, quantity: 0}
            ]
        })).toBe(false);
    });

    it('should not validate without quantity', () => {
        expect(shoppingCart.valid({
            items: [
                {productId: 65, quantity: 1},
                {productId: 33, quantity: 1},
                {productId: 65}
            ]
        })).toBe(false);
    });

    it('should not validate without product', () => {
        expect(shoppingCart.valid({
            items: [
                {productId: 65, quantity: 1},
                {quantity: 1},
                {productId: 65, quantity: 9}
            ]
        })).toBe(false);
    });

    describe('should calculate totals', () => {

        beforeAll(() => {
            mockData.initialiseDatabase(database);
        });

        it('for Guest', () => {
            const cart = shoppingCart.calculate({
                items: [
                    {productId: mockData.adIds.classic, quantity: 2},
                    {productId: mockData.adIds.premium, quantity: 3}
                ]
            });
            expect(cart.customerName).toEqual('Guest');
            expect(cart.items).toContainEqual({
                productId: mockData.adIds.classic,
                name: 'Classic Ad',
                quantity: 2,
                unitPrice: 269.99,
                totalItemPrice: 539.98
            });
            expect(cart.items).toContainEqual({
                productId: mockData.adIds.premium,
                name: 'Premium Ad',
                quantity: 3,
                unitPrice: 394.99,
                totalItemPrice: 1184.97
            });
            expect(cart.orderTotal).toBeCloseTo(1724.95, 2);
        });

        it('for MYER', () => {
            const cart = shoppingCart.calculate({
                customerId: mockData.customerIds.myer,
                items: [
                    {productId: mockData.adIds.standout, quantity: 7},
                    {productId: mockData.adIds.classic, quantity: 2},
                    {productId: mockData.adIds.premium, quantity: 3}
                ]
            });
            expect(cart.customerName).toEqual('MYER');
            expect(cart.items).toContainEqual(
                {
                    productId: mockData.adIds.standout,
                    quantity: 7,
                    name: 'Stand out Ad',
                    unitPrice: 322.99,
                    // Price of 6 instead of 7 (since they get 1 free for every 5)
                    totalItemPrice: 1937.94
                });
            expect(cart.items).toContainEqual({
                productId: mockData.adIds.classic,
                quantity: 2,
                name: 'Classic Ad',
                unitPrice: 269.99,
                totalItemPrice: 539.98
            });
            expect(cart.items).toContainEqual({
                productId: mockData.adIds.premium,
                quantity: 3,
                name: 'Premium Ad',
                // MYER's exclusive price
                unitPrice: 389.99,
                totalItemPrice: 1169.97
            });
            expect(cart.orderTotal).toBeCloseTo(3647.89, 2);
        });

        it('for SecondBite', () => {
            const cart = shoppingCart.calculate({
                customerId: mockData.customerIds.secondBite,
                items: [
                    {productId: mockData.adIds.standout, quantity: 2},
                    {productId: mockData.adIds.classic, quantity: 7}
                ]
            });
            expect(cart.customerName).toEqual('SecondBite');
            expect(cart.items).toContainEqual({
                productId: mockData.adIds.standout,
                quantity: 2,
                name: 'Stand out Ad',
                unitPrice: 322.99,
                totalItemPrice: 645.98
            });
            expect(cart.items).toContainEqual({
                productId: mockData.adIds.classic,
                quantity: 7,
                name: 'Classic Ad',
                unitPrice: 269.99,
                // Price of 5 instead of 7 (2 free since they get 1 free for every 3)
                totalItemPrice: 1349.95
            });
            expect(cart.orderTotal).toBeCloseTo(1995.93, 2);
        });

        it('for Axil', () => {
            const cart = shoppingCart.calculate({
                customerId: mockData.customerIds.axil,
                items: [
                    {productId: mockData.adIds.standout, quantity: 3},
                    {productId: mockData.adIds.classic, quantity: 2}
                ]
            });
            expect(cart.customerName).toEqual('Axil Coffee Roasters');
            expect(cart.items).toContainEqual({
                productId: mockData.adIds.standout,
                quantity: 3,
                name: 'Stand out Ad',
                // Exclusive price for Axil
                unitPrice: 299.99,
                totalItemPrice: 899.97
            });
            expect(cart.items).toContainEqual({
                productId: mockData.adIds.classic,
                quantity: 2,
                name: 'Classic Ad',
                unitPrice: 269.99,
                totalItemPrice: 539.98
            });
            expect(cart.orderTotal).toBeCloseTo(1439.95, 2);
        });

    });

});
