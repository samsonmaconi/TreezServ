const assert = require('assert');

describe('DB TESTS', ()=> {
  const name = 'Test Product 1'
  const description = 'Mocha Test Product'
  const price = 500
  const quantityAvailable = 30
  let id = null

  it('Test Insert and Fetching - Product Name should be `Test Product 1`', async ()=> {
    let product = await Inventory.create({name, description, price, quantityAvailable}).fetch()
    id = product.id
    product = null
    product = await Inventory.findOne(id)
    assert.equal(product.name, name);
  });

  it('Test Update (Adjusting Stock Count) - Quantity should be 25', async ()=> {
    let product = await Inventory.update(id).set({quantityAvailable: quantityAvailable-5}).fetch()
    assert.equal(product[0].quantityAvailable, quantityAvailable - 5);
  });

  it('Test Deletion - Product should be null', async ()=> {
    let product = await Inventory.destroy(id).fetch()
    product = null
    product = await Inventory.findOne(id)
    assert.equal(product, null);
  });

});


