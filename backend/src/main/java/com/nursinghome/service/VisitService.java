package com.nursinghome.service;

import com.nursinghome.entity.VisitRecord;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VisitService {

    @Autowired
    private DataRepository dataRepository;

    public List<VisitRecord> getAllVisitRecords() {
        return new ArrayList<>(dataRepository.getVisitRecords().values());
    }

    public Optional<VisitRecord> getVisitRecordById(Long id) {
        return Optional.ofNullable(dataRepository.getVisitRecords().get(id));
    }

    public List<VisitRecord> getVisitRecordsByElder(Long elderId) {
        List<VisitRecord> result = new ArrayList<>();
        for (VisitRecord record : dataRepository.getVisitRecords().values()) {
            if (elderId.equals(record.getElderId())) {
                result.add(record);
            }
        }
        return result;
    }

    public List<VisitRecord> getPendingVisitRecords() {
        List<VisitRecord> result = new ArrayList<>();
        for (VisitRecord record : dataRepository.getVisitRecords().values()) {
            if ("PENDING".equals(record.getStatus())) {
                result.add(record);
            }
        }
        return result;
    }

    public VisitRecord createVisitReservation(VisitRecord record) {
        record.setId(dataRepository.generateVisitRecordId());
        record.setStatus("PENDING");
        record.setCreateTime(LocalDateTime.now());
        dataRepository.getVisitRecords().put(record.getId(), record);
        return record;
    }

    public Optional<VisitRecord> checkIn(Long id) {
        VisitRecord record = dataRepository.getVisitRecords().get(id);
        if (record == null || !"PENDING".equals(record.getStatus())) {
            return Optional.empty();
        }
        record.setStatus("IN_PROGRESS");
        record.setActualCheckInTime(LocalDateTime.now());
        return Optional.of(record);
    }

    public Optional<VisitRecord> checkOut(Long id, String note) {
        VisitRecord record = dataRepository.getVisitRecords().get(id);
        if (record == null || !"IN_PROGRESS".equals(record.getStatus())) {
            return Optional.empty();
        }
        record.setStatus("COMPLETED");
        record.setActualCheckOutTime(LocalDateTime.now());
        if (note != null) {
            record.setNote(note);
        }
        return Optional.of(record);
    }

    public Optional<VisitRecord> cancelReservation(Long id) {
        VisitRecord record = dataRepository.getVisitRecords().get(id);
        if (record == null) {
            return Optional.empty();
        }
        record.setStatus("CANCELLED");
        return Optional.of(record);
    }

    public boolean deleteVisitRecord(Long id) {
        return dataRepository.getVisitRecords().remove(id) != null;
    }
}
