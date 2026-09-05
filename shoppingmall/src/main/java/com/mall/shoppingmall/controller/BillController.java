package com.mall.shoppingmall.controller;

import com.mall.shoppingmall.model.Bill;
import com.mall.shoppingmall.model.dto.BillRequest;
import com.mall.shoppingmall.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    // GET all bills
    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    // GET a single bill by ID
    @GetMapping("/{id}")
    public Bill getBillById(@PathVariable Integer id) {
        return billService.getBillById(id);
    }

    // POST - create a new bill with multiple items
    @PostMapping
    public Bill createBill(@RequestBody BillRequest billRequest) {
        return billService.createBill(billRequest);
    }

    // DELETE a bill
    @DeleteMapping("/{id}")
    public void deleteBill(@PathVariable Integer id) {
        billService.deleteBill(id);
    }
}