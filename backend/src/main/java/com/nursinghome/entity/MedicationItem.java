package com.nursinghome.entity;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class MedicationItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long medicationPlanId;
    private String medicationName;
    private String dosage;
    private String unit;
    private LocalTime scheduledTime;
    private String frequency;
    private String route;
    private String status;
    private BigDecimal price;
}
