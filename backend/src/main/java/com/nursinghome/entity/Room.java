package com.nursinghome.entity;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class Room implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String roomNumber;
    private String careArea;
    private String roomType;
    private Integer bedCount;
    private Integer occupiedBedCount;
    private BigDecimal basePrice;
    private String status;
    private String description;
    private List<Bed> beds;
}
