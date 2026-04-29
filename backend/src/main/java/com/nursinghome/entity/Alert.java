package com.nursinghome.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class Alert implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String alertType;
    private String alertLevel;
    private Long elderId;
    private String elderName;
    private Long taskId;
    private String taskName;
    private String title;
    private String description;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime handleTime;
    
    private String handledBy;
    private String handleNote;
}
