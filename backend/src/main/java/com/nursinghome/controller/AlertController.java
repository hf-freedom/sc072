package com.nursinghome.controller;

import com.nursinghome.entity.Alert;
import com.nursinghome.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable Long id) {
        Optional<Alert> alert = alertService.getAlertById(id);
        return alert.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public List<Alert> getActiveAlerts() {
        return alertService.getActiveAlerts();
    }

    @GetMapping("/elder/{elderId}")
    public List<Alert> getAlertsByElder(@PathVariable Long elderId) {
        return alertService.getAlertsByElder(elderId);
    }

    @PostMapping
    public Alert createAlert(
            @RequestParam String alertType,
            @RequestParam String alertLevel,
            @RequestParam(required = false) Long elderId,
            @RequestParam(required = false) String elderName,
            @RequestParam(required = false) Long taskId,
            @RequestParam(required = false) String taskName,
            @RequestParam String title,
            @RequestParam(required = false) String description) {
        return alertService.createAlert(alertType, alertLevel, elderId, elderName, taskId, taskName, title, description);
    }

    @PutMapping("/{id}/handle")
    public ResponseEntity<Alert> handleAlert(
            @PathVariable Long id,
            @RequestParam(required = false) String handledBy,
            @RequestParam(required = false) String handleNote) {
        Optional<Alert> alert = alertService.handleAlert(id, handledBy, handleNote);
        return alert.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
