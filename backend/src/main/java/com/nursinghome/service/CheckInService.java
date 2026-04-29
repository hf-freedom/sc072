package com.nursinghome.service;

import com.nursinghome.entity.*;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CheckInService {

    @Autowired
    private DataRepository dataRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private CarePlanService carePlanService;

    public CheckInResult checkIn(Elder elder, Long bedId) {
        CheckInResult result = new CheckInResult();
        
        Elder existingElder = null;
        if (elder.getId() != null) {
            existingElder = dataRepository.getElders().get(elder.getId());
        }

        if (existingElder == null) {
            elder.setId(dataRepository.generateElderId());
            if (elder.getEmergencyContacts() != null) {
                for (int i = 0; i < elder.getEmergencyContacts().size(); i++) {
                    EmergencyContact contact = elder.getEmergencyContacts().get(i);
                    contact.setId((long) (i + 1));
                    contact.setElderId(elder.getId());
                }
            }
            elder.setStatus("ACTIVE");
            elder.setCheckInDate(LocalDate.now());
            elder.setIsTemporaryLeave(false);
            dataRepository.getElders().put(elder.getId(), elder);
            result.setElder(elder);
        } else {
            result.setElder(existingElder);
            elder = existingElder;
        }

        if (bedId != null) {
            boolean bedAssigned = roomService.assignBed(bedId, elder.getId(), elder.getName());
            if (bedAssigned) {
                Bed bed = dataRepository.getBeds().get(bedId);
                elder.setBedId(bed.getBedNumber());
                result.setBed(bed);
            }
        }

        CarePlan carePlan = carePlanService.createCarePlan(elder);
        result.setCarePlan(carePlan);

        carePlanService.generateDailyTasks(elder, LocalDate.now());

        result.setSuccess(true);
        result.setMessage("入住成功，护理计划已生成");

        return result;
    }

    public static class CheckInResult {
        private boolean success;
        private String message;
        private Elder elder;
        private Bed bed;
        private CarePlan carePlan;

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Elder getElder() {
            return elder;
        }

        public void setElder(Elder elder) {
            this.elder = elder;
        }

        public Bed getBed() {
            return bed;
        }

        public void setBed(Bed bed) {
            this.bed = bed;
        }

        public CarePlan getCarePlan() {
            return carePlan;
        }

        public void setCarePlan(CarePlan carePlan) {
            this.carePlan = carePlan;
        }
    }
}
