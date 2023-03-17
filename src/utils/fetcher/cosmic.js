import Cosmic from "cosmicjs";
const api = Cosmic();
import dotenv from "dotenv";
dotenv.config();

const bucket = api.bucket({
  slug: process.env.COSMIC_SLUG,
  read_key: process.env.COSMIC_READ_KEY,
});


class CosmicFetch {
  static async fetchProducts() {
    try {
      const data = await bucket.objects.find({
        type: "products",
        props: "slug,title,content,metadata",
      });
      return data;
    } catch (e) {
      console.log("error in fetching products ", e);
      return [];
    }
  }

  static async fetchCartProducts(productIds) {
    try {
      const data = await bucket.objects.find({
        type: "products",
        props: "slug,title,content,metadata",
        ids: productIds
      });
      return data;
    } catch (e) {
      console.log("error in fetching products ", e);
      return [];
    }
  }
}


export default CosmicFetch;
