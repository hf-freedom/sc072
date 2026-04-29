package com.nursinghome.controller;

import com.nursinghome.entity.VisitRecord;
import com.nursinghome.service.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = "*")
public class VisitController {

    @Autowired
    private VisitService visitService;

    @GetMapping
    public List<VisitRecord> getAllVisitRecords() {
        return visitService.getAllVisitRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisitRecord> getVisitRecordById(@PathVariable Long id) {
        Optional<VisitRecord> record = visitService.getVisitRecordById(id);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/elder/{elderId}")
    public List<VisitRecord> getVisitRecordsByElder(@PathVariable Long elderId) {
        return visitService.getVisitRecordsByElder(elderId);
    }

    @GetMapping("/pending")
    public List<VisitRecord> getPendingVisitRecords() {
        return visitService.getPendingVisitRecords();
    }

    @PostMapping
    public VisitRecord createVisitReservation(@RequestBody VisitRecord record) {
        return visitService.createVisitReservation(record);
    }

    @PutMapping("/{id}/check-in")
    public ResponseEntity<VisitRecord> checkIn(@PathVariable Long id) {
        Optional<VisitRecord> record = visitService.checkIn(id);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/check-out")
    public ResponseEntity<VisitRecord> checkOut(
            @PathVariable Long id,
            @RequestParam(required = false) String note) {
        Optional<VisitRecord> record = visitService.checkOut(id, note);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<VisitRecord> cancelReservation(@PathVariable Long id) {
        Optional<VisitRecord> record = visitService.cancelReservation(id);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisitRecord(@PathVariable Long id) {
        boolean deleted = visitService.deleteVisitRecord(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
