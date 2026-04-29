package com.nursinghome.service;

import com.nursinghome.entity.Elder;
import com.nursinghome.entity.EmergencyContact;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ElderService {

    @Autowired
    private DataRepository dataRepository;

    public List<Elder> getAllElders() {
        return new ArrayList<>(dataRepository.getElders().values());
    }

    public Optional<Elder> getElderById(Long id) {
        return Optional.ofNullable(dataRepository.getElders().get(id));
    }

    public List<Elder> getActiveElders() {
        List<Elder> activeElders = new ArrayList<>();
        for (Elder elder : dataRepository.getElders().values()) {
            if ("ACTIVE".equals(elder.getStatus())) {
                activeElders.add(elder);
            }
        }
        return activeElders;
    }

    public Elder createElder(Elder elder) {
        elder.setId(dataRepository.generateElderId());
        if (elder.getBirthDate() != null) {
            elder.setAge(calculateAge(elder.getBirthDate()));
        }
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
        return elder;
    }

    public Optional<Elder> updateElder(Long id, Elder updatedElder) {
        Elder existing = dataRepository.getElders().get(id);
        if (existing == null) {
            return Optional.empty();
        }
        if (updatedElder.getName() != null) {
            existing.setName(updatedElder.getName());
        }
        if (updatedElder.getIdCard() != null) {
            existing.setIdCard(updatedElder.getIdCard());
        }
        if (updatedElder.getGender() != null) {
            existing.setGender(updatedElder.getGender());
        }
        if (updatedElder.getBirthDate() != null) {
            existing.setBirthDate(updatedElder.getBirthDate());
            existing.setAge(calculateAge(updatedElder.getBirthDate()));
        }
        if (updatedElder.getPhone() != null) {
            existing.setPhone(updatedElder.getPhone());
        }
        if (updatedElder.getAddress() != null) {
            existing.setAddress(updatedElder.getAddress());
        }
        if (updatedElder.getCareLevel() != null) {
            existing.setCareLevel(updatedElder.getCareLevel());
        }
        if (updatedElder.getHealthStatus() != null) {
            existing.setHealthStatus(updatedElder.getHealthStatus());
        }
        if (updatedElder.getEmergencyContacts() != null) {
            for (int i = 0; i < updatedElder.getEmergencyContacts().size(); i++) {
                EmergencyContact contact = updatedElder.getEmergencyContacts().get(i);
                contact.setId((long) (i + 1));
                contact.setElderId(id);
            }
            existing.setEmergencyContacts(updatedElder.getEmergencyContacts());
        }
        return Optional.of(existing);
    }

    public boolean deleteElder(Long id) {
        return dataRepository.getElders().remove(id) != null;
    }

    public Optional<Elder> updateCareLevel(Long elderId, String careLevel) {
        Elder elder = dataRepository.getElders().get(elderId);
        if (elder == null) {
            return Optional.empty();
        }
        elder.setCareLevel(careLevel);
        return Optional.of(elder);
    }

    public Optional<Elder> updateHealthStatus(Long elderId, String healthStatus) {
        Elder elder = dataRepository.getElders().get(elderId);
        if (elder == null) {
            return Optional.empty();
        }
        elder.setHealthStatus(healthStatus);
        return Optional.of(elder);
    }

    public Optional<Elder> setTemporaryLeave(Long elderId, Boolean isTemporaryLeave) {
        Elder elder = dataRepository.getElders().get(elderId);
        if (elder == null) {
            return Optional.empty();
        }
        elder.setIsTemporaryLeave(isTemporaryLeave);
        return Optional.of(elder);
    }

    private Integer calculateAge(LocalDate birthDate) {
        if (birthDate == null) {
            return null;
        }
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}
