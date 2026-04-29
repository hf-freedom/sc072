package com.nursinghome.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class EmergencyContact implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long elderId;
    private String name;
    private String relationship;
    private String phone;
    private String address;
    private Boolean isPrimary;
}
