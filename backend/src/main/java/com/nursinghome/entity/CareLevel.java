package com.nursinghome.entity;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CareLevel implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String levelCode;
    private String levelName;
    private String description;
    private BigDecimal monthlyFee;
    private List<String> dailyTasks;
    private Integer sortOrder;
    private String status;
}
