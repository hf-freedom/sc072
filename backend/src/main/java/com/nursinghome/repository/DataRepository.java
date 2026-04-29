package com.nursinghome.repository;

import com.nursinghome.entity.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class DataRepository {

    private final Map<Long, Elder> elders = new ConcurrentHashMap<>();
    private final Map<Long, Room> rooms = new ConcurrentHashMap<>();
    private final Map<Long, Bed> beds = new ConcurrentHashMap<>();
    private final Map<Long, CareLevel> careLevels = new ConcurrentHashMap<>();
    private final Map<Long, CarePlan> carePlans = new ConcurrentHashMap<>();
    private final Map<Long, CareTask> careTasks = new ConcurrentHashMap<>();
    private final Map<Long, MedicationPlan> medicationPlans = new ConcurrentHashMap<>();
    private final Map<Long, VisitRecord> visitRecords = new ConcurrentHashMap<>();
    private final Map<Long, Bill> bills = new ConcurrentHashMap<>();
    private final Map<Long, Alert> alerts = new ConcurrentHashMap<>();
    private final Map<Long, Nurse> nurses = new ConcurrentHashMap<>();

    private final AtomicLong elderIdGenerator = new AtomicLong(1);
    private final AtomicLong roomIdGenerator = new AtomicLong(1);
    private final AtomicLong bedIdGenerator = new AtomicLong(1);
    private final AtomicLong careLevelIdGenerator = new AtomicLong(1);
    private final AtomicLong carePlanIdGenerator = new AtomicLong(1);
    private final AtomicLong careTaskIdGenerator = new AtomicLong(1);
    private final AtomicLong medicationPlanIdGenerator = new AtomicLong(1);
    private final AtomicLong visitRecordIdGenerator = new AtomicLong(1);
    private final AtomicLong billIdGenerator = new AtomicLong(1);
    private final AtomicLong alertIdGenerator = new AtomicLong(1);
    private final AtomicLong nurseIdGenerator = new AtomicLong(1);

    public Long generateElderId() {
        return elderIdGenerator.getAndIncrement();
    }

    public Long generateRoomId() {
        return roomIdGenerator.getAndIncrement();
    }

    public Long generateBedId() {
        return bedIdGenerator.getAndIncrement();
    }

    public Long generateCareLevelId() {
        return careLevelIdGenerator.getAndIncrement();
    }

    public Long generateCarePlanId() {
        return carePlanIdGenerator.getAndIncrement();
    }

    public Long generateCareTaskId() {
        return careTaskIdGenerator.getAndIncrement();
    }

    public Long generateMedicationPlanId() {
        return medicationPlanIdGenerator.getAndIncrement();
    }

    public Long generateVisitRecordId() {
        return visitRecordIdGenerator.getAndIncrement();
    }

    public Long generateBillId() {
        return billIdGenerator.getAndIncrement();
    }

    public Long generateAlertId() {
        return alertIdGenerator.getAndIncrement();
    }

    public Long generateNurseId() {
        return nurseIdGenerator.getAndIncrement();
    }

    public Map<Long, Elder> getElders() {
        return elders;
    }

    public Map<Long, Room> getRooms() {
        return rooms;
    }

    public Map<Long, Bed> getBeds() {
        return beds;
    }

    public Map<Long, CareLevel> getCareLevels() {
        return careLevels;
    }

    public Map<Long, CarePlan> getCarePlans() {
        return carePlans;
    }

    public Map<Long, CareTask> getCareTasks() {
        return careTasks;
    }

    public Map<Long, MedicationPlan> getMedicationPlans() {
        return medicationPlans;
    }

    public Map<Long, VisitRecord> getVisitRecords() {
        return visitRecords;
    }

    public Map<Long, Bill> getBills() {
        return bills;
    }

    public Map<Long, Alert> getAlerts() {
        return alerts;
    }

    public Map<Long, Nurse> getNurses() {
        return nurses;
    }
}
