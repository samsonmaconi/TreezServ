/**
 * OrdersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Joi = require('@hapi/joi');

const schema = {
  create: Joi.object({
    customer: Joi.string().email().required(),
    orderItems: Joi.array().items(Joi.object({
      item: Joi.number().required(),
      count: Joi.number().required(),
    })).required(),
  }),

  update: Joi.object({
    orderItems: Joi.array().items(Joi.object({
      item: Joi.number().required(),
      count: Joi.number().required(),
    })),
    status: Joi.any().valid('completed'),
  }),

}

module.exports = {
  getAll: async (req, res) => {
    let result = await Order.find()
    if (result.length === 0) {
      res.status(204).send()
      return true
    }
    res.send(result)
  },

  getOne: async (req, res) => {
    let id = +req.param('id')
    if (!_.isNumber(id) || _.isNaN(id)) {
      return res.status(404).send({ error: 'Invalid ID specified!' });
    }
    let result = await Order.findOne(id).populate('orderItems')

    if (result === undefined) {
      res.status(404).send({ error: 'Order not found!' })
    }

    res.send(result)
  },

  create: async (req, res) => {
    if (!isValidSchema(req.body, schema['create'], res)) {
      return false
    }
    let { customer, orderItems } = req.body

    if (!await updateInventory(orderItems, res)) {
      return false
    }

    let newOrder = await Order.create({ customer, status: 'incomplete' }).fetch()

    orderItems.forEach(item => { item['order'] = newOrder.id })
    await OrderItem.createEach(orderItems).fetch()
    await Order.update(newOrder.id).set({ status: 'ready' })

    newOrder = await Order.findOne(newOrder.id).populate('orderItems')

    res.status(201).send({ message: 'New Order Created!', order: newOrder })
  },

  update: async (req, res) => {
    if (!isValidSchema(req.body, schema['update'], res)) {
      return 0
    }
    let id = +req.param('id')
    if (!_.isNumber(id) || _.isNaN(id)) {
      return res.status(404).send({ error: 'Invalid ID specified!' });
    }
    let order = await Order.findOne({ id, status: { '!=': ['canceled', 'completed'] } }).populate('orderItems') // cancelled and completed Orders cannot be updated
    if (order === undefined) {
      return res.status(404).send({ error: 'Order not valid for update!' })
    }

    let { orderItems, status = order.status } = req.body
    if (orderItems) {
      let oldOrderItems = order.orderItems
      console.log('oldOrderItems :', oldOrderItems);
      await reverseInventory(oldOrderItems)
      await Order.replaceCollection(order.id, 'orderItems').members([])

      if (!await updateInventory(orderItems, res)) {
        return false
      }

      orderItems.forEach(item => {item['order'] = id})
      await OrderItem.createEach(orderItems).fetch()
    }

    await Order.update(id).set({ status }).fetch()

    let updatedOrder = await Order.findOne(order.id).populate('orderItems')
    res.status(202).send({
      message: `Order ${id} Updated!`,
      updatedOrder: updatedOrder
    })
  },

  delete: async (req, res) => {
    let id = +req.param('id')
    if (!_.isNumber(id) || _.isNaN(id)) {
      return res.status(404).send({ error: 'Invalid ID specified!' });
    }
    let result = await Order.findOne({ id, status: { '!=': ['canceled', 'completed'] } }).populate('orderItems')

    if (result === undefined) {
      res.status(404).send({ error: 'Order not valid for deletion!' })
      return false
    }

    await reverseInventory(result.orderItems)
    let deletedOrder = await Order.update(id).set({ status: 'canceled' }).fetch()

    res.status(202).send({
      message: `Order ${id} Deleted!`,
      deletedOrder
    })
  },

};


async function reverseInventory(orderItems) {
  console.log('orderItems :', orderItems);
  let ids = []
  orderItems.forEach(e => ids.push(e.item))
  let result = await Inventory.find({ id: ids, deleted: false })
  if (result.length !== ids.length) {
    res.status(500).send({ error: 'One or more invalid order items detected! Kindly contact the Administrator!' })
    return false
  }
  let newInventoryStats = orderItems.map(e => ({
    count: result.filter(a => a.id === e.item)[0].quantityAvailable + e.count,
    item: e.item,
  }))
  newInventoryStats.forEach(async entry => {
    await Inventory.update(entry.item).set({ quantityAvailable: entry.count })
  })
}


async function updateInventory(orderItems, res) {
  let ids = []
  orderItems.forEach(e => ids.push(e.item))
  let result = await Inventory.find({ id: ids, deleted: false })
  if (result.length !== ids.length) {
    res.status(400).send({ error: 'One or more invalid order items detected!' })
    return false
  }
  let newInventoryStats = orderItems.map(e => ({
    count: result.filter(a => a.id === e.item)[0].quantityAvailable - e.count,
    item: e.item,
  }))
  if (isInventoryAvailable(newInventoryStats, res)) {
    newInventoryStats.forEach(async entry => {
      await Inventory.update(entry.item).set({ quantityAvailable: entry.count })
    })
    return true
  }
  return false
}

function isInventoryAvailable(newInventoryStats, res) {
  let insufficientItems = newInventoryStats.reduce((insufficientItems, entry) => {
    if (entry.count < 0) {
      insufficientItems.push(entry.item)
    }
    return insufficientItems
  }, [])

  if (insufficientItems.length > 0) {
    res.status(200).send({
      error: 'Request cannot be completed due to Insufficient Inventory for one or more order items!',
      insufficientItems
    })
    return false
  }
  return true
}

function isValidSchema(value, schema, res) {
  let schemaValidation = schema.validate(value)
  let errors = []
  if (schemaValidation.error) {
    schemaValidation.error.details.forEach(err => errors.push(err.message))
    res.status(406).send({ errors })
    return false
  }
  return true
}
