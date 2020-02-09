const supertest = require('supertest');
const assert = require('assert');


describe('ORDERS HTTP TESTS', () => {

  const testProduct1 = {
    name: 'Test Product 1',
    description: 'Mocha Test Product',
    price: 40,
    quantityAvailable: 30
  }
  const testProduct2 = {
    name: 'Test Product 2',
    description: 'Hot Mocha Test Product',
    price: 55,
    quantityAvailable: 20
  }
  let updatedTestOrderItems = null
  let testProduct1Id = null
  let testProduct2Id = null
  let testOrder = null
  let testOrderId = null


  describe('POST (CREATE)', () => {
    it('Should return with status `201` with product name = `Test Item 1` and Json Content Type', (done) => {

      // Init Setup
      Promise.all([Inventory.create(testProduct1).fetch(), Inventory.create(testProduct2).fetch()])
        .then(([testPro1, testPro2]) => {
          testProduct1Id = testPro1.id
          testProduct2Id = testPro2.id

          testOrder = {
            customer: 'test@samsonmaconi.com',
            orderItems: [
              { item: testProduct1Id, 'count': 15 },
              { item: testProduct2Id, 'count': 20 }
            ]
          }

          updatedTestOrderItems =
            [{ item: testProduct1Id, count: 5 }]


          supertest(sails.hooks.http.app)
            .post('/orders')
            .send(testOrder)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(async (err, res) => {
              if (err) { return done(err); }
              assert.equal(res.body.order.customer, testOrder.customer)
              testOrderId = res.body.order.id
              done();
            });

        })


    });
    it('Should reduce quantityAvailable for Product1 and Product2 to 15 and 0 respectively in the Inventory', async () => {
      let product1 = await Inventory.findOne(testProduct1Id)
      let product2 = await Inventory.findOne(testProduct2Id)
      assert.equal(product1.quantityAvailable, 15);
      assert.equal(product2.quantityAvailable, 0);
    });
  });


  describe('GET ALL', () => {
    it('Should return with status `200` a Json Content Type', (done) => {

      supertest(sails.hooks.http.app)
        .get('/orders')
        .expect(200)
        .end((err) => {
          if (err) { return done(err); }
          done();
        });

    });
  });

  describe('GET ONE', () => {
    it('Should return with status `200`; one Item only (Test Item 1) and Json Content Type', (done) => {
      supertest(sails.hooks.http.app)
        .get(`/orders/${testOrderId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) { return done(err); }
          assert.equal(res.body.customer, testOrder.customer)
          done();
        });
    });
  });

  describe('PUT (UPDATE)', () => {
    it('Should return with status `202` with Order Details changed and Json Content Type', (done) => {
      supertest(sails.hooks.http.app)
        .put(`/orders/${testOrderId}`)
        .send({ orderItems: updatedTestOrderItems })
        .expect(202)
        .expect('Content-Type', /json/)
        .end(async (err, res) => {
          if (err) { return done(err); }
          assert.equal(res.body.updatedOrder.orderItems[0].count, updatedTestOrderItems[0].count)
          done();
        });
    });

    it('Should reverse previous Inventory quantityAvailable updates for the Order and reduce only Product1 to 25', async () => {
      let product1 = await Inventory.findOne(testProduct1Id)
      let product2 = await Inventory.findOne(testProduct2Id)
      assert.equal(product1.quantityAvailable, 25);
      assert.equal(product2.quantityAvailable, 20);
    });
  });

  describe('DELETE (CANCEL ORDER)', () => {
    it('Should return with status `202` with product Deleted flag set to True and Json Content Type', (done) => {
      supertest(sails.hooks.http.app)
        .delete(`/orders/${testOrderId}`)
        .expect(202)
        .expect('Content-Type', /json/)
        .end(async (err, res) => {
          if (err) { return done(err); }
          assert.equal(res.body.deletedOrder.status, 'canceled')

          // clean up
          await Inventory.destroy({ id: [testProduct1Id, testProduct2Id] })
          await Order.destroy(testOrderId)
          await OrderItem.destroy({ order: testOrderId })
          done();
        });
    });
  });
});

