import prisma from "../../db/index.js";
import CosmicFetch from "../fetcher/cosmic.js";

class Home {
  static async migrateProducts() {
    let cosmicProductsData = await CosmicFetch.fetchProducts();
    console.dir(cosmicProductsData, {
      depth: null
    });
    let finalData = [];
    cosmicProductsData.objects &&
      cosmicProductsData.objects.map((item) => {
        let tempObj = {
          name: item.title,
          slug: item.slug,
          price: item.metadata.price,
          category: item.metadata.category,
          image: item.metadata.image.url,
          description: item.content || "",
        };
        finalData.push(tempObj);
        
      });

    console.log("final data is ", finalData);

    const productsData = await prisma.Product.findMany();

    // compare the data
    let newProducts = [];
    finalData.map((item) => {
      let found = productsData.find((product) => product.name === item.name);
      if (!found) {
        newProducts.push(item);
      }
    });
    console.log("new products are ", newProducts);

    if (newProducts.length != 0) {
      let _newProducts = await prisma.Product.createMany({
        data: newProducts,
      });
      console.log("new products are ", _newProducts);
      return _newProducts;
    } else {
      return [];
    }
  }

  static async homeDataHandler() {
    let productsData = await prisma.Product.findMany();
    console.log("products data is ", productsData);
    return productsData;
  }
}

export default Home;