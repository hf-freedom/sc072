package com.nursinghome.controller;

import com.nursinghome.service.CheckOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/check-out")
@CrossOrigin(origins = "*")
public class CheckOutController {

    @Autowired
    private CheckOutService checkOutService;

    @PostMapping
    public ResponseEntity<CheckOutService.CheckOutResult> checkOut(
            @RequestParam Long elderId,
            @RequestParam(required = false) String reason) {
        CheckOutService.CheckOutResult result = checkOutService.checkOut(elderId, reason);
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}
