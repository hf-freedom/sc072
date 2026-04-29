package com.nursinghome.controller;

import com.nursinghome.entity.CareLevel;
import com.nursinghome.entity.Nurse;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/common")
@CrossOrigin(origins = "*")
public class CommonController {

    @Autowired
    private DataRepository dataRepository;

    @GetMapping("/care-levels")
    public List<CareLevel> getAllCareLevels() {
        return new ArrayList<>(dataRepository.getCareLevels().values());
    }

    @GetMapping("/care-levels/{id}")
    public CareLevel getCareLevelById(@PathVariable Long id) {
        return dataRepository.getCareLevels().get(id);
    }

    @GetMapping("/care-levels/code/{code}")
    public CareLevel getCareLevelByCode(@PathVariable String code) {
        for (CareLevel level : dataRepository.getCareLevels().values()) {
            if (code.equals(level.getLevelCode())) {
                return level;
            }
        }
        return null;
    }

    @GetMapping("/nurses")
    public List<Nurse> getAllNurses() {
        return new ArrayList<>(dataRepository.getNurses().values());
    }

    @GetMapping("/nurses/{id}")
    public Nurse getNurseById(@PathVariable Long id) {
        return dataRepository.getNurses().get(id);
    }

    @GetMapping("/nurses/on-duty")
    public List<Nurse> getOnDutyNurses() {
        List<Nurse> onDuty = new ArrayList<>();
        for (Nurse nurse : dataRepository.getNurses().values()) {
            if ("ON_DUTY".equals(nurse.getStatus())) {
                onDuty.add(nurse);
            }
        }
        return onDuty;
    }

    @GetMapping("/care-areas")
    public List<String> getAllCareAreas() {
        List<String> areas = new ArrayList<>();
        areas.add("护理一区");
        areas.add("护理二区");
        areas.add("护理三区");
        return areas;
    }

    @GetMapping("/room-types")
    public List<String> getAllRoomTypes() {
        List<String> types = new ArrayList<>();
        types.add("单人间");
        types.add("双人间");
        types.add("三人间");
        types.add("多人间");
        return types;
    }

    @GetMapping("/health-status")
    public List<String> getAllHealthStatus() {
        List<String> statuses = new ArrayList<>();
        statuses.add("良好");
        statuses.add("一般");
        statuses.add("需要照护");
        statuses.add("危重");
        return statuses;
    }
}
