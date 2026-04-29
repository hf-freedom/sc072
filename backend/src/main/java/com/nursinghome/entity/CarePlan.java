package com.nursinghome.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CarePlan implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long elderId;
    private String elderName;
    private String careLevel;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
    
    private String status;
    private List<CareTaskTemplate> taskTemplates;
}
