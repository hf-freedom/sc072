package com.nursinghome.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class Nurse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String employeeNo;
    private String name;
    private String gender;
    private String phone;
    private String careLevel;
    private List<String> assignedAreas;
    private String status;
}
