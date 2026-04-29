package com.nursinghome.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class VisitRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long elderId;
    private String elderName;
    private String visitorName;
    private String visitorPhone;
    private String relationship;
    private Integer visitorCount;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate visitDate;
    
    private LocalTime scheduledStartTime;
    private LocalTime scheduledEndTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actualCheckInTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actualCheckOutTime;
    
    private String status;
    private String note;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
}
