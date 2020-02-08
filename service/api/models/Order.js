/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    customer: {model: 'Customer'},
    status: {
      type: 'string',
      required: true,
      isIn:['incomplete', 'ready', 'canceled', 'completed'],
    },
    createdAt: { type: 'number', autoCreatedAt: true, },
    orderItems: {collection: 'OrderItem', via:'order' }
  },

};

