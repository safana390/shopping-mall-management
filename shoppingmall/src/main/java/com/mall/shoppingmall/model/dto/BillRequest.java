package com.mall.shoppingmall.model.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class BillRequest {
    private Integer customerId;
    private Integer shopId;
    private List<BillItemRequest> items;
}