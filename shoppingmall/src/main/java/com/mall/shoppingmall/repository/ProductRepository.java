package com.mall.shoppingmall.repository;

import com.mall.shoppingmall.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Custom query: find all products belonging to a specific shop
    List<Product> findByShopShopId(Integer shopId);
}