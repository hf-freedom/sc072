package com.nursinghome.controller;

import com.nursinghome.entity.Elder;
import com.nursinghome.service.ElderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/elders")
@CrossOrigin(origins = "*")
public class ElderController {

    @Autowired
    private ElderService elderService;

    @GetMapping
    public List<Elder> getAllElders() {
        return elderService.getAllElders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Elder> getElderById(@PathVariable Long id) {
        Optional<Elder> elder = elderService.getElderById(id);
        return elder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public List<Elder> getActiveElders() {
        return elderService.getActiveElders();
    }

    @PostMapping
    public Elder createElder(@RequestBody Elder elder) {
        return elderService.createElder(elder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Elder> updateElder(@PathVariable Long id, @RequestBody Elder elder) {
        Optional<Elder> updated = elderService.updateElder(id, elder);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElder(@PathVariable Long id) {
        boolean deleted = elderService.deleteElder(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/care-level")
    public ResponseEntity<Elder> updateCareLevel(@PathVariable Long id, @RequestParam String careLevel) {
        Optional<Elder> updated = elderService.updateCareLevel(id, careLevel);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/health-status")
    public ResponseEntity<Elder> updateHealthStatus(@PathVariable Long id, @RequestParam String healthStatus) {
        Optional<Elder> updated = elderService.updateHealthStatus(id, healthStatus);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/temporary-leave")
    public ResponseEntity<Elder> setTemporaryLeave(@PathVariable Long id, @RequestParam Boolean isTemporaryLeave) {
        Optional<Elder> updated = elderService.setTemporaryLeave(id, isTemporaryLeave);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
