/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  if (await Customer.count() === 0 ){
    await Customer.createEach([
      {id: 'sam@samsonmaconi.com', firstName: 'Samson', lastName: 'Maconi'}
    ])
  }

  if (await Inventory.count() === 0 ){
    await Inventory.createEach([
      {name: 'Aquafina', description: 'Bottled Watter', price: '5', quantityAvailable: '20'},
      {name: 'Bread', description: 'Plain Bread', price: '10', quantityAvailable: '6'},
      {name: 'Milk', description: 'Almond Milk', price: '13.5', quantityAvailable: '17'},
      {name: 'Plantains', price: '14.0', quantityAvailable: '5'},
      {name: 'Mangoes', description: 'Awesome fruit', price: '8.45', quantityAvailable: '25'},
    ])
  }

};
