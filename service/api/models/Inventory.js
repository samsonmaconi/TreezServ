/**
 * Inventory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {type: 'string', required:true},
    description: {type: 'string', required:false},
    price: {type: 'number', required:true},
    quantityAvailable: {type: 'number', required:true},
    deleted: {
      type: 'boolean',
      defaultsTo: false
    },
  },

};

