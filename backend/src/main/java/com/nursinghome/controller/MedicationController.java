package com.nursinghome.controller;

import com.nursinghome.entity.MedicationPlan;
import com.nursinghome.service.MedicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = "*")
public class MedicationController {

    @Autowired
    private MedicationService medicationService;

    @GetMapping
    public List<MedicationPlan> getAllMedicationPlans() {
        return medicationService.getAllMedicationPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicationPlan> getMedicationPlanById(@PathVariable Long id) {
        Optional<MedicationPlan> plan = medicationService.getMedicationPlanById(id);
        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/elder/{elderId}")
    public List<MedicationPlan> getMedicationPlansByElder(@PathVariable Long elderId) {
        return medicationService.getMedicationPlansByElder(elderId);
    }

    @PostMapping
    public MedicationPlan createMedicationPlan(@RequestBody MedicationPlan plan) {
        return medicationService.createMedicationPlan(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicationPlan> updateMedicationPlan(
            @PathVariable Long id,
            @RequestBody MedicationPlan plan) {
        Optional<MedicationPlan> updated = medicationService.updateMedicationPlan(id, plan);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<MedicationPlan> deactivateMedicationPlan(@PathVariable Long id) {
        Optional<MedicationPlan> plan = medicationService.deactivateMedicationPlan(id);
        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicationPlan(@PathVariable Long id) {
        boolean deleted = medicationService.deleteMedicationPlan(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
