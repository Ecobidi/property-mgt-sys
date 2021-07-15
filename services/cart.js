const CartModel = require('../models/cart')

let findCartOrCreateIfNotExists = async (customer_id) => {
  let cart = await CartModel.findOne({customer_id})
  // create cart object if doesn't exist
  if (!cart) {
    await CartModel.create({ customer_id, properties: [], properties_quantities: new Object() })
    cart = await CartModel.findOne({customer_id})
  }
  return cart
}

class CartService {

  static async findCart(customer_id) {
    return CartModel.findOne({customer_id}).populate('properties').exec()
  }

  static async addItem(newItem, customer_id) {
    let cart = await findCartOrCreateIfNotExists(customer_id)
    let itemIndex = cart.properties.findIndex((id => "" + id === "" + newItem.property_id))
    if (itemIndex > -1) {
      cart.properties_quantities[newItem.property_id] = newItem.quantity
    } else {
      cart.properties.push(newItem.property_id)
      cart.properties_quantities[newItem.property_id] = newItem.quantity
    }
    cart.markModified('properties_quantities')
    return cart.save()
  }

  static async removeItem(property_id, customer_id) {
    let cart = await CartModel.findOne({customer_id})
    let itemIndex = cart.properties.findIndex((id => "" + id === "" + property_id))
    cart.properties.splice(itemIndex, 1)
    delete cart.properties_quantities[property_id]
    cart.markModified('properties_quantities')
    return cart.save()
  }

  static async clearCart(customer_id) {
    return CartModel.remove({customer_id})
  }

}

module.exports = CartService