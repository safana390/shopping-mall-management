package com.mall.shoppingmall.service;

import com.mall.shoppingmall.model.Shop;
import com.mall.shoppingmall.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    // Get all shops
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    // Get a single shop by ID
    public Shop getShopById(Integer id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
    }

    // Add a new shop
    public Shop addShop(Shop shop) {
        return shopRepository.save(shop);
    }

    // Update an existing shop
    public Shop updateShop(Integer id, Shop shopDetails) {
        Shop shop = getShopById(id); // reuse the method above, throws if not found

        shop.setName(shopDetails.getName());
        shop.setCategory(shopDetails.getCategory());
        shop.setFloorNumber(shopDetails.getFloorNumber());
        shop.setOwnerName(shopDetails.getOwnerName());
        shop.setContact(shopDetails.getContact());

        return shopRepository.save(shop);
    }

    // Delete a shop
    public void deleteShop(Integer id) {
        Shop shop = getShopById(id);
        shopRepository.delete(shop);
    }
}