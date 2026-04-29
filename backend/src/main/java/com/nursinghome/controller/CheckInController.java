package com.nursinghome.controller;

import com.nursinghome.entity.Elder;
import com.nursinghome.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/check-in")
@CrossOrigin(origins = "*")
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    @PostMapping
    public ResponseEntity<CheckInService.CheckInResult> checkIn(
            @RequestBody CheckInRequest request) {
        CheckInService.CheckInResult result = checkInService.checkIn(
            request.getElder(),
            request.getBedId()
        );
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    public static class CheckInRequest {
        private Elder elder;
        private Long bedId;

        public Elder getElder() {
            return elder;
        }

        public void setElder(Elder elder) {
            this.elder = elder;
        }

        public Long getBedId() {
            return bedId;
        }

        public void setBedId(Long bedId) {
            this.bedId = bedId;
        }
    }
}
