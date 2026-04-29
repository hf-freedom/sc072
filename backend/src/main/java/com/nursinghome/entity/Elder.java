package com.nursinghome.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Data
public class Elder implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String idCard;
    private String gender;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthDate;
    
    private Integer age;
    private String phone;
    private String address;
    private String careLevel;
    private String healthStatus;
    private List<EmergencyContact> emergencyContacts;
    private String status;
    private String bedId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkInDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkOutDate;
    
    private Boolean isTemporaryLeave;
}
