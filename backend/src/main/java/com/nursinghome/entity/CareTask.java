package com.nursinghome.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class CareTask implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long elderId;
    private String elderName;
    private Long carePlanId;
    private Long templateId;
    private String taskName;
    private String taskDescription;
    
    private LocalDate taskDate;
    private LocalTime scheduledTime;
    
    private String nurseId;
    private String nurseName;
    
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime executeTime;
    
    private String executeResult;
    private String executeNote;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
    
    private Boolean isPaused;
}
