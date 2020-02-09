const assert = require('assert');

describe('DB TESTS', () => {
  const testProduct1 = {
    name: 'Test Product 1',
    description: 'Mocha Test Product',
    price: 500,
    quantityAvailable: 50
  }
  let id = null

  it('Test Insert and Fetching - Product Name should be `Test Product 1`', async () => {
    let product = await Inventory.create(testProduct1).fetch()
    id = product.id
    product = null
    product = await Inventory.findOne(id)
    assert.equal(product.name, testProduct1.name);
  });

  it('Test Update (Adjusting Stock Count) - Quantity should be 25', async () => {
    let product = await Inventory.update(id).set({ quantityAvailable: testProduct1.quantityAvailable - 5 }).fetch()
    assert.equal(product[0].quantityAvailable, testProduct1.quantityAvailable - 5);
  });

  it('Test Deletion - Product should be null', async () => {
    let product = await Inventory.destroy(id).fetch()
    product = null
    product = await Inventory.findOne(id)
    assert.equal(product, null);
  });

});


