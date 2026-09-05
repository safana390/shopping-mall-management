package com.mall.shoppingmall.service;

import com.mall.shoppingmall.model.*;
import com.mall.shoppingmall.model.dto.BillRequest;
import com.mall.shoppingmall.model.dto.BillItemRequest;
import com.mall.shoppingmall.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ShopService shopService;

    @Autowired
    private ProductService productService;

    // Get all bills
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    // Get a single bill by ID
    public Bill getBillById(Integer id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
    }

    // Create a new bill with multiple items
    public Bill createBill(BillRequest billRequest) {

        // 1. Fetch the customer and shop (throws if either doesn't exist)
        Customer customer = customerService.getCustomerById(billRequest.getCustomerId());
        Shop shop = shopService.getShopById(billRequest.getShopId());

        // 2. Create the Bill object (without items yet)
        Bill bill = new Bill();
        bill.setCustomer(customer);
        bill.setShop(shop);
        bill.setBillDate(LocalDateTime.now());

        // 3. Build the list of BillItems from the request
        List<BillItem> billItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (BillItemRequest itemRequest : billRequest.getItems()) {
            Product product = productService.getProductById(itemRequest.getProductId());

            BillItem billItem = new BillItem();
            billItem.setBill(bill); // link back to the parent bill
            billItem.setProduct(product);
            billItem.setQuantity(itemRequest.getQuantity());
            billItem.setPriceAtSale(product.getPrice()); // capture current price

            // Calculate this item's subtotal and add to running total
            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            billItems.add(billItem);
        }

        // 4. Attach items and total to the bill
        bill.setItems(billItems);
        bill.setTotalAmount(totalAmount);

        // 5. Save — cascade automatically saves all BillItems too
        return billRepository.save(bill);
    }

    // Delete a bill (also deletes its items, thanks to orphanRemoval)
    public void deleteBill(Integer id) {
        Bill bill = getBillById(id);
        billRepository.delete(bill);
    }
}