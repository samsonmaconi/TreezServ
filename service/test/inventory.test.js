const supertest = require('supertest');
const assert = require('assert');


const testItem = { name: 'Test Item 1', description: 'Sample Item for Test', price: 17, quantityAvailable: 25 }
let testItemId = null
const newTestItemPrice = 50

describe('INVENTORIES HTTP TESTS', () => {
  describe('GET ALL', () => {
    it('Should return with status `200` and Json Content Type', (done) => {
      supertest(sails.hooks.http.app)
        .get('/inventories')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err) => {
          if (err) { return done(err); }
          done();
        });
    });
  });

  describe('POST (CREATE)', () => {
    it('Should return with status `201` with product name = `Test Item 1` and Json Content Type', (done) => {
      supertest(sails.hooks.http.app)
        .post('/inventories')
        .send(testItem)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(async (err, res) => {
          if (err) { return done(err); }
          assert.equal(res.body.item.name, testItem.name)
          testItemId = res.body.item.id
          done();
        });
    });
  });

  describe('GET ONE', () => {
    it('Should return with status `200`; one Item only (Test Item 1) and Json Content Type', (done) => {
      supertest(sails.hooks.http.app)
        .get(`/inventories/${testItemId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) { return done(err); }
          assert.equal(res.body.name, testItem.name)
          done();
        });
    });
  });

  describe('PUT (UPDATE)', () => {
    it('Should return with status `202` with product price = 50 and Json Content Type', (done) => {
      supertest(sails.hooks.http.app)
        .put(`/inventories/${testItemId}`)
        .send({ price: newTestItemPrice })
        .expect(202)
        .expect('Content-Type', /json/)
        .end(async (err, res) => {
          if (err) { return done(err); }
          assert.equal(res.body.item.price, newTestItemPrice)
          done();
        });
    });
  });

  describe('DELETE', () => {
    it('Should return with status `202` with product Deleted flag set to True and Json Content Type', (done) => {
      supertest(sails.hooks.http.app)
        .delete(`/inventories/${testItemId}`)
        .expect(202)
        .expect('Content-Type', /json/)
        .end(async (err, res) => {
          if (err) { return done(err); }
          assert.equal(res.body.deletedItem.deleted, true)

          // clean up
          await Inventory.destroy(testItemId)
          done();
        });
    });
  });
});

