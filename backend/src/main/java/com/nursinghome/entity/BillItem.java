package com.nursinghome.entity;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class BillItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long billId;
    private String itemType;
    private String itemName;
    private String itemDescription;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private String note;
}
