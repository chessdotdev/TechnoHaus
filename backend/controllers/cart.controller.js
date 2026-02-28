import { Cart } from "../models/cart.model.js";
import { Products } from "../models/products.model.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if(quantity <=0){
      return res.status(400).json({
        message: "Invalid quantity"
      });
    }

    // Check if product exists
    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      const item = cart.items.find(i => i.product.equals(productId));
      if (item) item.quantity += quantity;
      else cart.items.push({ product: productId, quantity });
      await cart.save();
    }

    await cart.populate("items.product");
    
    res.json({ message: "Added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add to cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({user: userId}).populate("items.product");

    if(!cart){
      return res.status(200).json({ cart: { items: [] } });    }

    res.status(200).json({ cart });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not retrieve cart" });
  }

}

const removeFromCart  = async (req, res)=> {
  try {
    const userId = req.user.userId;
    const {productId} = req.body;

    if(!productId){
      return res.status(400).json({ message: "Product ID required" });
    }

    const cart = await Cart.findOne({user: userId});
    // console.log(cart.items[0].product);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(i => i.product.equals(productId));
    if(itemIndex === -1){
      return res.status(404).json({ message: "Product not in cart" });
    }
    cart.items.splice(itemIndex, 1);

    await cart.save();
    await cart.populate("items.product");

    res.json({ message: "Removed from cart", cart });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not remove from cart" });
  }
}

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ 
        message: `Invalid quantity. Must be between 1` 
      });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ user: userId });

    const item = cart.items.find(i => i.product.equals(productId));
    if (!item) {
      return res.status(404).json({ message: "Product not in cart" });
    }
    // console.log(item);
    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.json({ message: "Quantity updated", cart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update quantity" });
  }
}

export { addToCart, getCart, removeFromCart, updateQuantity };
