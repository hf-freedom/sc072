package com.nursinghome.config;

import com.nursinghome.entity.*;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DataRepository dataRepository;

    @Override
    public void run(String... args) {
        initCareLevels();
        initNurses();
        initRoomsAndBeds();
        initElders();
    }

    private void initCareLevels() {
        CareLevel level1 = new CareLevel();
        level1.setId(dataRepository.generateCareLevelId());
        level1.setLevelCode("LEVEL1");
        level1.setLevelName("一级护理");
        level1.setDescription("生活完全自理，健康状况良好");
        level1.setMonthlyFee(new BigDecimal("2000"));
        level1.setDailyTasks(Arrays.asList("晨间护理", "午间巡查", "晚间护理", "健康监测（每周）"));
        level1.setSortOrder(1);
        level1.setStatus("ACTIVE");

        CareLevel level2 = new CareLevel();
        level2.setId(dataRepository.generateCareLevelId());
        level2.setLevelCode("LEVEL2");
        level2.setLevelName("二级护理");
        level2.setDescription("生活部分自理，需要协助");
        level2.setMonthlyFee(new BigDecimal("3500"));
        level2.setDailyTasks(Arrays.asList("晨间护理", "协助进食", "午间巡查", "协助活动", "晚间护理", "健康监测（每日）"));
        level2.setSortOrder(2);
        level2.setStatus("ACTIVE");

        CareLevel level3 = new CareLevel();
        level3.setId(dataRepository.generateCareLevelId());
        level3.setLevelCode("LEVEL3");
        level3.setLevelName("三级护理");
        level3.setDescription("生活基本不能自理，需要全面照护");
        level3.setMonthlyFee(new BigDecimal("5000"));
        level3.setDailyTasks(Arrays.asList("晨间护理", "协助进食", "午间巡查", "协助活动", "晚间护理", "健康监测（每日2次）", "压疮护理", "排泄物处理"));
        level3.setSortOrder(3);
        level3.setStatus("ACTIVE");

        CareLevel level4 = new CareLevel();
        level4.setId(dataRepository.generateCareLevelId());
        level4.setLevelCode("LEVEL4");
        level4.setLevelName("特级护理");
        level4.setDescription("危重病人，24小时专人监护");
        level4.setMonthlyFee(new BigDecimal("8000"));
        level4.setDailyTasks(Arrays.asList("24小时专人监护", "生命体征监测", "病情观察", "基础护理", "记录护理单", "并发症预防"));
        level4.setSortOrder(4);
        level4.setStatus("ACTIVE");

        dataRepository.getCareLevels().put(level1.getId(), level1);
        dataRepository.getCareLevels().put(level2.getId(), level2);
        dataRepository.getCareLevels().put(level3.getId(), level3);
        dataRepository.getCareLevels().put(level4.getId(), level4);
    }

    private void initNurses() {
        Nurse nurse1 = new Nurse();
        nurse1.setId(dataRepository.generateNurseId());
        nurse1.setEmployeeNo("N001");
        nurse1.setName("张护士");
        nurse1.setGender("女");
        nurse1.setPhone("13800138001");
        nurse1.setCareLevel("高级");
        nurse1.setAssignedAreas(Arrays.asList("护理一区", "护理二区"));
        nurse1.setStatus("ON_DUTY");

        Nurse nurse2 = new Nurse();
        nurse2.setId(dataRepository.generateNurseId());
        nurse2.setEmployeeNo("N002");
        nurse2.setName("李护士");
        nurse2.setGender("女");
        nurse2.setPhone("13800138002");
        nurse2.setCareLevel("中级");
        nurse2.setAssignedAreas(Arrays.asList("护理一区"));
        nurse2.setStatus("ON_DUTY");

        Nurse nurse3 = new Nurse();
        nurse3.setId(dataRepository.generateNurseId());
        nurse3.setEmployeeNo("N003");
        nurse3.setName("王护士");
        nurse3.setGender("男");
        nurse3.setPhone("13800138003");
        nurse3.setCareLevel("初级");
        nurse3.setAssignedAreas(Arrays.asList("护理二区", "护理三区"));
        nurse3.setStatus("ON_DUTY");

        dataRepository.getNurses().put(nurse1.getId(), nurse1);
        dataRepository.getNurses().put(nurse2.getId(), nurse2);
        dataRepository.getNurses().put(nurse3.getId(), nurse3);
    }

    private void initRoomsAndBeds() {
        Room room101 = new Room();
        room101.setId(dataRepository.generateRoomId());
        room101.setRoomNumber("101");
        room101.setCareArea("护理一区");
        room101.setRoomType("双人间");
        room101.setBedCount(2);
        room101.setOccupiedBedCount(0);
        room101.setBasePrice(new BigDecimal("1500"));
        room101.setStatus("AVAILABLE");
        room101.setDescription("标准双人间，朝南");
        room101.setBeds(new ArrayList<>());

        Bed bed101_1 = new Bed();
        bed101_1.setId(dataRepository.generateBedId());
        bed101_1.setBedNumber("101-01");
        bed101_1.setRoomId(room101.getId());
        bed101_1.setRoomNumber(room101.getRoomNumber());
        bed101_1.setCareArea(room101.getCareArea());
        bed101_1.setPrice(new BigDecimal("1500"));
        bed101_1.setStatus("AVAILABLE");
        room101.getBeds().add(bed101_1);

        Bed bed101_2 = new Bed();
        bed101_2.setId(dataRepository.generateBedId());
        bed101_2.setBedNumber("101-02");
        bed101_2.setRoomId(room101.getId());
        bed101_2.setRoomNumber(room101.getRoomNumber());
        bed101_2.setCareArea(room101.getCareArea());
        bed101_2.setPrice(new BigDecimal("1500"));
        bed101_2.setStatus("AVAILABLE");
        room101.getBeds().add(bed101_2);

        Room room102 = new Room();
        room102.setId(dataRepository.generateRoomId());
        room102.setRoomNumber("102");
        room102.setCareArea("护理一区");
        room102.setRoomType("单人间");
        room102.setBedCount(1);
        room102.setOccupiedBedCount(0);
        room102.setBasePrice(new BigDecimal("2500"));
        room102.setStatus("AVAILABLE");
        room102.setDescription("豪华单人间，朝南");
        room102.setBeds(new ArrayList<>());

        Bed bed102_1 = new Bed();
        bed102_1.setId(dataRepository.generateBedId());
        bed102_1.setBedNumber("102-01");
        bed102_1.setRoomId(room102.getId());
        bed102_1.setRoomNumber(room102.getRoomNumber());
        bed102_1.setCareArea(room102.getCareArea());
        bed102_1.setPrice(new BigDecimal("2500"));
        bed102_1.setStatus("AVAILABLE");
        room102.getBeds().add(bed102_1);

        Room room201 = new Room();
        room201.setId(dataRepository.generateRoomId());
        room201.setRoomNumber("201");
        room201.setCareArea("护理二区");
        room201.setRoomType("双人间");
        room201.setBedCount(2);
        room201.setOccupiedBedCount(0);
        room201.setBasePrice(new BigDecimal("1800"));
        room201.setStatus("AVAILABLE");
        room201.setDescription("康复双人间，朝北");
        room201.setBeds(new ArrayList<>());

        Bed bed201_1 = new Bed();
        bed201_1.setId(dataRepository.generateBedId());
        bed201_1.setBedNumber("201-01");
        bed201_1.setRoomId(room201.getId());
        bed201_1.setRoomNumber(room201.getRoomNumber());
        bed201_1.setCareArea(room201.getCareArea());
        bed201_1.setPrice(new BigDecimal("1800"));
        bed201_1.setStatus("AVAILABLE");
        room201.getBeds().add(bed201_1);

        Bed bed201_2 = new Bed();
        bed201_2.setId(dataRepository.generateBedId());
        bed201_2.setBedNumber("201-02");
        bed201_2.setRoomId(room201.getId());
        bed201_2.setRoomNumber(room201.getRoomNumber());
        bed201_2.setCareArea(room201.getCareArea());
        bed201_2.setPrice(new BigDecimal("1800"));
        bed201_2.setStatus("AVAILABLE");
        room201.getBeds().add(bed201_2);

        dataRepository.getRooms().put(room101.getId(), room101);
        dataRepository.getRooms().put(room102.getId(), room102);
        dataRepository.getRooms().put(room201.getId(), room201);

        dataRepository.getBeds().put(bed101_1.getId(), bed101_1);
        dataRepository.getBeds().put(bed101_2.getId(), bed101_2);
        dataRepository.getBeds().put(bed102_1.getId(), bed102_1);
        dataRepository.getBeds().put(bed201_1.getId(), bed201_1);
        dataRepository.getBeds().put(bed201_2.getId(), bed201_2);
    }

    private void initElders() {
        Elder elder1 = new Elder();
        elder1.setId(dataRepository.generateElderId());
        elder1.setName("王建国");
        elder1.setIdCard("110101194501150011");
        elder1.setGender("男");
        elder1.setBirthDate(LocalDate.of(1945, 1, 15));
        elder1.setAge(80);
        elder1.setPhone("13900139001");
        elder1.setAddress("北京市朝阳区");
        elder1.setCareLevel("LEVEL2");
        elder1.setHealthStatus("良好");
        elder1.setStatus("ACTIVE");
        elder1.setCheckInDate(LocalDate.now().minusMonths(2));
        elder1.setIsTemporaryLeave(false);

        EmergencyContact contact1 = new EmergencyContact();
        contact1.setId(1L);
        contact1.setElderId(elder1.getId());
        contact1.setName("王明");
        contact1.setRelationship("儿子");
        contact1.setPhone("13800138111");
        contact1.setAddress("北京市朝阳区");
        contact1.setIsPrimary(true);
        elder1.setEmergencyContacts(Arrays.asList(contact1));

        Elder elder2 = new Elder();
        elder2.setId(dataRepository.generateElderId());
        elder2.setName("李秀英");
        elder2.setIdCard("110101195005200022");
        elder2.setGender("女");
        elder2.setBirthDate(LocalDate.of(1950, 5, 20));
        elder2.setAge(74);
        elder2.setPhone("13900139002");
        elder2.setAddress("北京市海淀区");
        elder2.setCareLevel("LEVEL1");
        elder2.setHealthStatus("良好");
        elder2.setStatus("ACTIVE");
        elder2.setCheckInDate(LocalDate.now().minusMonths(1));
        elder2.setIsTemporaryLeave(false);

        EmergencyContact contact2 = new EmergencyContact();
        contact2.setId(2L);
        contact2.setElderId(elder2.getId());
        contact2.setName("张芳");
        contact2.setRelationship("女儿");
        contact2.setPhone("13800138222");
        contact2.setAddress("北京市海淀区");
        contact2.setIsPrimary(true);
        elder2.setEmergencyContacts(Arrays.asList(contact2));

        Elder elder3 = new Elder();
        elder3.setId(dataRepository.generateElderId());
        elder3.setName("张志强");
        elder3.setIdCard("110101194010100033");
        elder3.setGender("男");
        elder3.setBirthDate(LocalDate.of(1940, 10, 10));
        elder3.setAge(84);
        elder3.setPhone("13900139003");
        elder3.setAddress("北京市西城区");
        elder3.setCareLevel("LEVEL3");
        elder3.setHealthStatus("需要照护");
        elder3.setStatus("ACTIVE");
        elder3.setCheckInDate(LocalDate.now().minusDays(15));
        elder3.setIsTemporaryLeave(false);

        EmergencyContact contact3 = new EmergencyContact();
        contact3.setId(3L);
        contact3.setElderId(elder3.getId());
        contact3.setName("张丽");
        contact3.setRelationship("女儿");
        contact3.setPhone("13800138333");
        contact3.setAddress("北京市西城区");
        contact3.setIsPrimary(true);
        elder3.setEmergencyContacts(Arrays.asList(contact3));

        dataRepository.getElders().put(elder1.getId(), elder1);
        dataRepository.getElders().put(elder2.getId(), elder2);
        dataRepository.getElders().put(elder3.getId(), elder3);
    }
}
