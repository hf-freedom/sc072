package com.nursinghome.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Bill implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String billNo;
    private Long elderId;
    private String elderName;
    
    private Integer billYear;
    private Integer billMonth;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate billDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;
    
    private List<BillItem> items;
    
    private BigDecimal bedFee;
    private BigDecimal careFee;
    private BigDecimal medicationFee;
    private BigDecimal extraServiceFee;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal unpaidAmount;
    
    private String status;
    private String paymentMethod;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime paidTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
    
    private Integer overdueDays;
    private Boolean hasReminder;
}
