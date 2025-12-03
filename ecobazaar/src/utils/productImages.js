// Product ID to Asset Image Mapping
import bamboo from "../assets/bamboo-toothbrush.jpg";
import bottle from "../assets/water-bottle.jpg";
import bag from "../assets/cotton-bag.jpg";
import straw from "../assets/metal-straw.jpg";
import soap from "../assets/organic-soap.jpg";
import cup from "../assets/reusable-cup.jpg";
import plate from "../assets/eco-plates.jpg";
import shampoo from "../assets/herbal-shampoo.jpg";
import cleaner from "../assets/bio-cleaner.jpg";
import notebook from "../assets/recycled-notebook.jpg";

// Map product_id to asset images
export const productImageMap = {
  1: bamboo,   // Bamboo Toothbrush
  2: bottle,   // Reusable Water Bottle
  3: bag,      // Organic Cotton Bag
  4: straw,    // Stainless Steel Straw Set
  5: soap,     // Organic Handmade Soap
  6: cup,      // Reusable Coffee Cup
  7: plate,    // Eco-Friendly Areca Plates
  8: shampoo,  // Herbal Shampoo Bar
  9: cleaner,  // Bio Enzyme Surface Cleaner
  10: notebook, // Recycled Paper Notebook
};

/**
 * Get asset image for a product by product_id
 * @param {number} productId - The product ID
 * @returns {string} - The asset image path or placeholder
 */
export const getProductImage = (productId) => {
  if (!productId) return "https://via.placeholder.com/250x180?text=Product";
  return productImageMap[productId] || "https://via.placeholder.com/250x180?text=Product";
};

/**
 * Get asset image for a product object
 * @param {object} product - Product object with product_id
 * @returns {string} - The asset image path or placeholder
 */
export const getProductImageFromObject = (product) => {
  if (!product) return "https://via.placeholder.com/250x180?text=Product";
  
  // First try to get from product_id
  if (product.product_id) {
    const assetImage = productImageMap[product.product_id];
    if (assetImage) return assetImage;
  }
  
  // Fallback to existing image_path or image
  if (product.image) return product.image;
  if (product.image_path) return product.image_path;
  
  return "https://via.placeholder.com/250x180?text=Product";
};

