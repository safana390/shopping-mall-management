package com.mall.shoppingmall.service;

import com.mall.shoppingmall.model.Product;
import com.mall.shoppingmall.model.Shop;
import com.mall.shoppingmall.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShopService shopService;

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get a single product by ID
    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // Get all products belonging to a specific shop
    public List<Product> getProductsByShopId(Integer shopId) {
        return productRepository.findByShopShopId(shopId);
    }

    // Add a new product to a shop
    public Product addProduct(Integer shopId, Product product) {
        Shop shop = shopService.getShopById(shopId); // reuse existing method, throws if shop doesn't exist
        product.setShop(shop);
        return productRepository.save(product);
    }

    // Update an existing product
    public Product updateProduct(Integer id, Product productDetails) {
        Product product = getProductById(id);

        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setStockQty(productDetails.getStockQty());

        return productRepository.save(product);
    }

    // Delete a product
    public void deleteProduct(Integer id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}