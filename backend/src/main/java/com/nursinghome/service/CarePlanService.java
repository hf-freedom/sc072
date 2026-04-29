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
import java.util.Optional;

@Service
public class CarePlanService {

    @Autowired
    private DataRepository dataRepository;

    public CarePlan createCarePlan(Elder elder) {
        CarePlan carePlan = new CarePlan();
        carePlan.setId(dataRepository.generateCarePlanId());
        carePlan.setElderId(elder.getId());
        carePlan.setElderName(elder.getName());
        carePlan.setCareLevel(elder.getCareLevel());
        carePlan.setCreateTime(LocalDateTime.now());
        carePlan.setUpdateTime(LocalDateTime.now());
        carePlan.setStatus("ACTIVE");

        List<CareTaskTemplate> templates = generateTaskTemplates(elder.getCareLevel(), carePlan.getId());
        carePlan.setTaskTemplates(templates);

        dataRepository.getCarePlans().put(carePlan.getId(), carePlan);
        return carePlan;
    }

    private List<CareTaskTemplate> generateTaskTemplates(String careLevel, Long carePlanId) {
        List<CareTaskTemplate> templates = new ArrayList<>();

        switch (careLevel) {
            case "LEVEL1":
                templates.add(createTemplate(carePlanId, "晨间护理", "协助洗漱、整理床铺", LocalTime.of(7, 0), 30, "LEVEL1"));
                templates.add(createTemplate(carePlanId, "午间巡查", "巡查房间，询问情况", LocalTime.of(12, 0), 15, "LEVEL1"));
                templates.add(createTemplate(carePlanId, "晚间护理", "协助洗漱、准备休息", LocalTime.of(20, 0), 30, "LEVEL1"));
                break;
            case "LEVEL2":
                templates.add(createTemplate(carePlanId, "晨间护理", "协助洗漱、整理床铺", LocalTime.of(7, 0), 45, "LEVEL2"));
                templates.add(createTemplate(carePlanId, "协助进食", "协助早餐", LocalTime.of(8, 0), 30, "LEVEL2"));
                templates.add(createTemplate(carePlanId, "午间巡查", "巡查房间，询问情况", LocalTime.of(12, 0), 20, "LEVEL2"));
                templates.add(createTemplate(carePlanId, "协助活动", "协助进行户外活动或康复训练", LocalTime.of(15, 0), 60, "LEVEL2"));
                templates.add(createTemplate(carePlanId, "晚间护理", "协助洗漱、准备休息", LocalTime.of(20, 0), 45, "LEVEL2"));
                break;
            case "LEVEL3":
                templates.add(createTemplate(carePlanId, "晨间护理", "协助洗漱、整理床铺", LocalTime.of(7, 0), 60, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "协助进食", "协助早餐", LocalTime.of(8, 0), 45, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "健康监测", "测量体温、血压", LocalTime.of(9, 0), 20, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "午间巡查", "巡查房间，询问情况", LocalTime.of(12, 0), 20, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "协助进食", "协助午餐", LocalTime.of(12, 30), 45, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "压疮护理", "检查皮肤状况，翻身", LocalTime.of(14, 0), 30, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "协助活动", "协助进行被动活动", LocalTime.of(15, 0), 60, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "健康监测", "测量体温、血压", LocalTime.of(18, 0), 20, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "协助进食", "协助晚餐", LocalTime.of(18, 30), 45, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "晚间护理", "协助洗漱、准备休息", LocalTime.of(20, 0), 60, "LEVEL3"));
                templates.add(createTemplate(carePlanId, "排泄物处理", "处理排泄物，保持清洁", LocalTime.of(21, 0), 30, "LEVEL3"));
                break;
            case "LEVEL4":
                templates.add(createTemplate(carePlanId, "晨间护理", "协助洗漱、整理床铺", LocalTime.of(6, 30), 60, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "生命体征监测", "测量体温、血压、心率", LocalTime.of(7, 30), 20, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "协助进食", "协助早餐", LocalTime.of(8, 0), 60, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "病情观察", "观察病情变化", LocalTime.of(9, 0), 30, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "生命体征监测", "测量体温、血压、心率", LocalTime.of(11, 0), 20, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "协助进食", "协助午餐", LocalTime.of(12, 0), 60, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "压疮护理", "检查皮肤状况，翻身", LocalTime.of(13, 0), 40, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "生命体征监测", "测量体温、血压、心率", LocalTime.of(15, 0), 20, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "病情观察", "观察病情变化", LocalTime.of(16, 0), 30, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "协助进食", "协助晚餐", LocalTime.of(18, 0), 60, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "生命体征监测", "测量体温、血压、心率", LocalTime.of(19, 0), 20, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "晚间护理", "协助洗漱、准备休息", LocalTime.of(20, 0), 60, "LEVEL4"));
                templates.add(createTemplate(carePlanId, "夜间巡查", "夜间巡查", LocalTime.of(2, 0), 20, "LEVEL4"));
                break;
            default:
                templates.add(createTemplate(carePlanId, "日常护理", "日常护理", LocalTime.of(9, 0), 30, "DEFAULT"));
        }

        for (int i = 0; i < templates.size(); i++) {
            templates.get(i).setId((long) (i + 1));
        }

        return templates;
    }

    private CareTaskTemplate createTemplate(Long carePlanId, String taskName, String description, 
                                             LocalTime scheduledTime, Integer duration, String careLevel) {
        CareTaskTemplate template = new CareTaskTemplate();
        template.setCarePlanId(carePlanId);
        template.setTaskName(taskName);
        template.setTaskDescription(description);
        template.setScheduledTime(scheduledTime);
        template.setEstimatedDuration(duration);
        template.setCareLevel(careLevel);
        template.setIsMandatory(true);
        return template;
    }

    public void generateDailyTasks(Elder elder, LocalDate date) {
        CarePlan carePlan = getCarePlanByElderId(elder.getId());
        if (carePlan == null) {
            carePlan = createCarePlan(elder);
        }

        if (carePlan.getTaskTemplates() == null) {
            return;
        }

        for (CareTaskTemplate template : carePlan.getTaskTemplates()) {
            CareTask task = new CareTask();
            task.setId(dataRepository.generateCareTaskId());
            task.setElderId(elder.getId());
            task.setElderName(elder.getName());
            task.setCarePlanId(carePlan.getId());
            task.setTemplateId(template.getId());
            task.setTaskName(template.getTaskName());
            task.setTaskDescription(template.getTaskDescription());
            task.setTaskDate(date);
            task.setScheduledTime(template.getScheduledTime());
            task.setStatus("PENDING");
            task.setCreateTime(LocalDateTime.now());
            task.setIsPaused(elder.getIsTemporaryLeave());

            dataRepository.getCareTasks().put(task.getId(), task);
        }
    }

    public List<CareTask> getTasksByDate(LocalDate date) {
        List<CareTask> result = new ArrayList<>();
        for (CareTask task : dataRepository.getCareTasks().values()) {
            if (date.equals(task.getTaskDate())) {
                result.add(task);
            }
        }
        return result;
    }

    public List<CareTask> getTasksByElderAndDate(Long elderId, LocalDate date) {
        List<CareTask> result = new ArrayList<>();
        for (CareTask task : dataRepository.getCareTasks().values()) {
            if (elderId.equals(task.getElderId()) && date.equals(task.getTaskDate())) {
                result.add(task);
            }
        }
        return result;
    }

    public Optional<CareTask> completeTask(Long taskId, String nurseId, String nurseName, String result, String note) {
        CareTask task = dataRepository.getCareTasks().get(taskId);
        if (task == null) {
            return Optional.empty();
        }
        task.setStatus("COMPLETED");
        task.setNurseId(nurseId);
        task.setNurseName(nurseName);
        task.setExecuteTime(LocalDateTime.now());
        task.setExecuteResult(result);
        task.setExecuteNote(note);
        return Optional.of(task);
    }

    public Optional<CareTask> pauseTask(Long taskId) {
        CareTask task = dataRepository.getCareTasks().get(taskId);
        if (task == null) {
            return Optional.empty();
        }
        task.setIsPaused(true);
        task.setStatus("PAUSED");
        return Optional.of(task);
    }

    public Optional<CareTask> resumeTask(Long taskId) {
        CareTask task = dataRepository.getCareTasks().get(taskId);
        if (task == null) {
            return Optional.empty();
        }
        task.setIsPaused(false);
        if ("PAUSED".equals(task.getStatus())) {
            task.setStatus("PENDING");
        }
        return Optional.of(task);
    }

    public CarePlan getCarePlanByElderId(Long elderId) {
        for (CarePlan plan : dataRepository.getCarePlans().values()) {
            if (elderId.equals(plan.getElderId()) && "ACTIVE".equals(plan.getStatus())) {
                return plan;
            }
        }
        return null;
    }

    public List<CarePlan> getAllCarePlans() {
        return new ArrayList<>(dataRepository.getCarePlans().values());
    }

    public Optional<CarePlan> getCarePlanById(Long id) {
        return Optional.ofNullable(dataRepository.getCarePlans().get(id));
    }

    public List<CareTask> getAllTasks() {
        return new ArrayList<>(dataRepository.getCareTasks().values());
    }

    public Optional<CareTask> getTaskById(Long id) {
        return Optional.ofNullable(dataRepository.getCareTasks().get(id));
    }
}
