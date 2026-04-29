package com.nursinghome.entity;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class Bed implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String bedNumber;
    private Long roomId;
    private String roomNumber;
    private String careArea;
    private BigDecimal price;
    private String status;
    private Long elderId;
    private String elderName;
}
