package com.mall.shoppingmall.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillItemRequest {
    private Integer productId;
    private Integer quantity;
}