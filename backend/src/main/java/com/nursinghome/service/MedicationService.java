package com.nursinghome.service;

import com.nursinghome.entity.MedicationItem;
import com.nursinghome.entity.MedicationPlan;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MedicationService {

    @Autowired
    private DataRepository dataRepository;

    public List<MedicationPlan> getAllMedicationPlans() {
        return new ArrayList<>(dataRepository.getMedicationPlans().values());
    }

    public Optional<MedicationPlan> getMedicationPlanById(Long id) {
        return Optional.ofNullable(dataRepository.getMedicationPlans().get(id));
    }

    public List<MedicationPlan> getMedicationPlansByElder(Long elderId) {
        List<MedicationPlan> result = new ArrayList<>();
        for (MedicationPlan plan : dataRepository.getMedicationPlans().values()) {
            if (elderId.equals(plan.getElderId())) {
                result.add(plan);
            }
        }
        return result;
    }

    public MedicationPlan createMedicationPlan(MedicationPlan plan) {
        plan.setId(dataRepository.generateMedicationPlanId());
        plan.setStatus("ACTIVE");
        plan.setCreateTime(LocalDateTime.now());
        plan.setUpdateTime(LocalDateTime.now());

        if (plan.getItems() != null) {
            for (int i = 0; i < plan.getItems().size(); i++) {
                MedicationItem item = plan.getItems().get(i);
                item.setId((long) (i + 1));
                item.setMedicationPlanId(plan.getId());
                item.setStatus("ACTIVE");
            }
        }

        dataRepository.getMedicationPlans().put(plan.getId(), plan);
        return plan;
    }

    public Optional<MedicationPlan> updateMedicationPlan(Long id, MedicationPlan updatedPlan) {
        MedicationPlan existing = dataRepository.getMedicationPlans().get(id);
        if (existing == null) {
            return Optional.empty();
        }

        if (updatedPlan.getDoctorName() != null) {
            existing.setDoctorName(updatedPlan.getDoctorName());
        }
        if (updatedPlan.getDiagnosis() != null) {
            existing.setDiagnosis(updatedPlan.getDiagnosis());
        }
        if (updatedPlan.getStartDate() != null) {
            existing.setStartDate(updatedPlan.getStartDate());
        }
        if (updatedPlan.getEndDate() != null) {
            existing.setEndDate(updatedPlan.getEndDate());
        }
        if (updatedPlan.getItems() != null) {
            for (int i = 0; i < updatedPlan.getItems().size(); i++) {
                MedicationItem item = updatedPlan.getItems().get(i);
                item.setId((long) (i + 1));
                item.setMedicationPlanId(id);
            }
            existing.setItems(updatedPlan.getItems());
        }
        existing.setUpdateTime(LocalDateTime.now());

        return Optional.of(existing);
    }

    public Optional<MedicationPlan> deactivateMedicationPlan(Long id) {
        MedicationPlan plan = dataRepository.getMedicationPlans().get(id);
        if (plan == null) {
            return Optional.empty();
        }
        plan.setStatus("INACTIVE");
        plan.setUpdateTime(LocalDateTime.now());
        return Optional.of(plan);
    }

    public boolean deleteMedicationPlan(Long id) {
        return dataRepository.getMedicationPlans().remove(id) != null;
    }
}
