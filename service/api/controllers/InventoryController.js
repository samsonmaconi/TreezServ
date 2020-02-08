/**
 * InventoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

Joi= require('@hapi/joi');

const schema = {
  create: Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().required(),
    quantityAvailable: Joi.number().required(),
  }),

  update: Joi.object({
    name: Joi.string().min(1),
    description: Joi.string().min(1),
    price: Joi.number(),
    quantityAvailable: Joi.number(),
  }),

}

module.exports = {
  getAll: async (req, res) => {
    let result = isAdminUser() ? await Inventory.find() : await Inventory.find({deleted: false})
    if (result.length===0){
      return res.status(204).send()
    }
    res.send(result)
  },

  getOne: async (req, res) => {
    let id = +req.param('id')
    if (!_.isNumber(id)  || _.isNaN(id)) {
      return res.status(404).send({error: 'Invalid ID specified!'});
    }
    let result = isAdminUser() ? await Inventory.findOne() : await Inventory.findOne({deleted: false})
    if (result===undefined){
      return res.status(404).send({error: 'Inventory Item not found!'})
    }
    res.send(result)
  },

  create: async (req, res) => {
    if(!isValidSchema(req.body, schema['create'], res)){
      return false
    }
    let {name, description="", price, quantityAvailable} = req.body
    price=+price
    quantityAvailable=+quantityAvailable
    await Inventory.create({name, description, price, quantityAvailable})
    res.status(201).send({message: "New Inventory Item Created!"})
  },

  update: async (req, res) => {
    if(!isValidSchema(req.body, schema['update'], res)){
      return 0
    }
    let id = +req.param('id')
    if (!_.isNumber(id)  || _.isNaN(id)) {
      return res.status(404).send({error: 'Invalid ID specified!'});
    }
    let result = await Inventory.findOne(id)
    if (result===undefined){
      return res.status(404).send({error: 'Inventory Item not found!'})
    }
    let {
      name=result.name,
      description=result.description,
      price=result.price,
      quantityAvailable=result.quantityAvailable,
      deleted=result.deleted
    } = req.body
    price=+price
    quantityAvailable=+quantityAvailable
    await Inventory.update(id).set({name, description, price, quantityAvailable, deleted})
    res.status(202).send({message: `Inventory Item ${id} Updated!`})
  },

  delete: async (req, res) => {
    let id = +req.param('id')
    if (!_.isNumber(id)  || _.isNaN(id)) {
      return res.status(404).send({error: 'Invalid ID specified!'});
    }
    let result = await Inventory.findOne(id)
    if (result===undefined){
      return res.status(404).send({error: 'Inventory Item not found!'})
    }
    let deletedRecord= await Inventory.update(id).set({deleted: true}).fetch()
    res.status(202).send({
      message: `Inventory Item ${id} Deleted!`,
      deletedItem: deletedRecord
    })
  },
};

function isValidSchema(value, schema, res){
  let schemaValidation = schema.validate(value)
  let errors = []
  if (schemaValidation.error){
    schemaValidation.error.details.forEach(err=>errors.push(err.message))
    res.status(406).send({errors})
    return false
  }
  return true
}

const isAdminUser = () => {
  // function to check user authorization level
  // admin user GETs deleted entries as well
  return false
}
