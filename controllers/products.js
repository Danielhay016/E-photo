const S_products = require('../services/products');
const StoreProduct = require('../models/product');

const C_products = {
  getAll: async () => {
    return await S_products.getAll();
  },

  updateProduct: async (product) => {
    return await S_products.updateProduct(product);
  },

  getProductByNameSearch: async (name) => {
    if (name)
      return await S_products.getProductByNameSearch(name);
    return await S_products.getAll();
  },

  deleteProduct: async (_id) => {
    return await S_products.deleteProduct(_id);
  },

  addProduct: async (name, image, brand, category, price, countInStock, rating, numReviews, description) => {
    try {
      return await S_products.addProduct(name, image, brand, category, price, countInStock, rating, numReviews, description);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  addProductsFromData: async (products) => {
    try {
      const insertPromises = products.map(async (product) => {
        const { name, image, brand, category, price, countInStock, rating, numReviews, description } = product;
        const newProduct = new StoreProduct({
          name,
          image,
          brand,
          category,
          price,
          countInStock,
          rating,
          numReviews,
          description,
        });
        await newProduct.save();
      });

      await Promise.all(insertPromises);

      return { message: 'Products added from data successfully' };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};


module.exports = C_products;


/*
// returns all Products without the id of each product
const getAll = async ()=> {
  return await S_products.getAll();
}

const updateProduct =  async (product)=> {
  return await S_products.updateProduct(product);
}

const getProductByNameSearch = async (name)=> {
  if(name)
      return await S_products.getProductByNameSearch(name);
  return await S_products.getAll();
}
const deleteProduct =  async (_id)=> {
  return await S_products.deleteProduct(_id);
}


 const addProduct = async (name,image,brand,category,price,countInStock,rating,numReviews,description)=> {
  try{
      return await S_products.addProduct(name,image,brand,category,price,countInStock,rating,numReviews,description);
  }
  catch(e){
      console.log(e);
      res.json({error:e});
  }
}

module.exports = {
    getAll,
    updateProduct,
    getProductByNameSearch,
    deleteProduct,
    addProduct,
}

*/