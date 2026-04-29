package com.nursinghome;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NursingHomeApplication {
    public static void main(String[] args) {
        SpringApplication.run(NursingHomeApplication.class, args);
    }
}
