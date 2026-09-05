package com.mall.shoppingmall.controller;

import com.mall.shoppingmall.model.Product;
import com.mall.shoppingmall.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;

    // GET all products
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // GET a single product by ID
    @GetMapping("/products/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    // GET all products for a specific shop
    @GetMapping("/shops/{shopId}/products")
    public List<Product> getProductsByShop(@PathVariable Integer shopId) {
        return productService.getProductsByShopId(shopId);
    }

    // POST - add a new product to a specific shop
    @PostMapping("/shops/{shopId}/products")
    public Product addProduct(@PathVariable Integer shopId, @RequestBody Product product) {
        return productService.addProduct(shopId, product);
    }

    // PUT - update an existing product
    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Integer id, @RequestBody Product productDetails) {
        return productService.updateProduct(id, productDetails);
    }

    // DELETE a product
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
    }
}