package com.nursinghome.controller;

import com.nursinghome.entity.CarePlan;
import com.nursinghome.entity.CareTask;
import com.nursinghome.service.CarePlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/care-plans")
@CrossOrigin(origins = "*")
public class CarePlanController {

    @Autowired
    private CarePlanService carePlanService;

    @GetMapping
    public List<CarePlan> getAllCarePlans() {
        return carePlanService.getAllCarePlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarePlan> getCarePlanById(@PathVariable Long id) {
        Optional<CarePlan> plan = carePlanService.getCarePlanById(id);
        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/elder/{elderId}")
    public CarePlan getCarePlanByElderId(@PathVariable Long elderId) {
        return carePlanService.getCarePlanByElderId(elderId);
    }

    @GetMapping("/tasks")
    public List<CareTask> getAllTasks() {
        return carePlanService.getAllTasks();
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<CareTask> getTaskById(@PathVariable Long id) {
        Optional<CareTask> task = carePlanService.getTaskById(id);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tasks/date/{date}")
    public List<CareTask> getTasksByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return carePlanService.getTasksByDate(localDate);
    }

    @GetMapping("/tasks/elder/{elderId}/date/{date}")
    public List<CareTask> getTasksByElderAndDate(
            @PathVariable Long elderId,
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return carePlanService.getTasksByElderAndDate(elderId, localDate);
    }

    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<CareTask> completeTask(
            @PathVariable Long taskId,
            @RequestParam(required = false) String nurseId,
            @RequestParam(required = false) String nurseName,
            @RequestParam String result,
            @RequestParam(required = false) String note) {
        Optional<CareTask> task = carePlanService.completeTask(taskId, nurseId, nurseName, result, note);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/tasks/{taskId}/pause")
    public ResponseEntity<CareTask> pauseTask(@PathVariable Long taskId) {
        Optional<CareTask> task = carePlanService.pauseTask(taskId);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/tasks/{taskId}/resume")
    public ResponseEntity<CareTask> resumeTask(@PathVariable Long taskId) {
        Optional<CareTask> task = carePlanService.resumeTask(taskId);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
