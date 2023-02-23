import prisma from "../../db/index.js";
import dotenv from "dotenv";
dotenv.config();

class Fetcher {
  static async fetchUser(id) {
    const _user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!_user) {
      return {
        status: false,
        data: null,
      };
    }
    return {
      status: false,
      data: _user,
    };
  }

  static async fetchCart(userid) {
    const _cart = await prisma.user.findUnique({
      where: {
        id: userid,
      },
      include: {
        addedProducts: true,
      },
    });
    const _products = await prisma.product.findMany({
      where: {
        id: {
          in: _cart.addedProducts.map((product) => product.productId),
        },
      },
    });
    // return _products with quantity
    const _cartProducts = [];
    _products.forEach((product) => {
      const _product_count = _cart.addedProducts.filter(
        (p) => p.productId === product.id
      );
      _cartProducts.push({
        ...product,
        quantity: _product_count.length
      });
    });

    if (!_cartProducts) {
      return {
        status: false,
        data: null,
      };
    }
    return {
      status: true,
      data: _cartProducts,
    };
  }

  static async addToCart(userid, productid, quantity) {
    let updatedCart = await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        addedProducts: {
          create: {
            productId: productid,
            quantity: quantity,
          }
        }
      },
    });
    console.log(updatedCart);
    return {
      status: true,
      message: 'added to cart',
      data: updatedCart,
    };
  }

  static async removeFromCart(userid, productid) {
    const _cart = await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        cart: {
          delete: {
            productId: productid,
          },
        },
      },
    });
    return {
      status: true,
      data: _cart,
    };
  }

  static async fetchProduct(slug) {
    const _product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!_product) {
      return {
        status: false,
        data: null,
      };
    }
    return {
      status: true,
      data: _product,
    };
  }
}

export default Fetcher;
