package com.nursinghome.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalTime;

@Data
public class CareTaskTemplate implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long carePlanId;
    private String taskName;
    private String taskDescription;
    private LocalTime scheduledTime;
    private Integer estimatedDuration;
    private String careLevel;
    private Boolean isMandatory;
}
