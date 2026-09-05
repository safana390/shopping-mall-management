package com.mall.shoppingmall.controller;

import com.mall.shoppingmall.model.Shop;
import com.mall.shoppingmall.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    @Autowired
    private ShopService shopService;

    // GET all shops
    @GetMapping
    public List<Shop> getAllShops() {
        return shopService.getAllShops();
    }

    // GET a single shop by ID
    @GetMapping("/{id}")
    public Shop getShopById(@PathVariable Integer id) {
        return shopService.getShopById(id);
    }

    // POST - create a new shop
    @PostMapping
    public Shop addShop(@RequestBody Shop shop) {
        return shopService.addShop(shop);
    }

    // PUT - update an existing shop
    @PutMapping("/{id}")
    public Shop updateShop(@PathVariable Integer id, @RequestBody Shop shopDetails) {
        return shopService.updateShop(id, shopDetails);
    }

    // DELETE a shop
    @DeleteMapping("/{id}")
    public void deleteShop(@PathVariable Integer id) {
        shopService.deleteShop(id);
    }
}