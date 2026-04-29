package com.nursinghome.service;

import com.nursinghome.entity.Alert;
import com.nursinghome.entity.CareTask;
import com.nursinghome.entity.Elder;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    @Autowired
    private DataRepository dataRepository;

    public List<Alert> getAllAlerts() {
        return new ArrayList<>(dataRepository.getAlerts().values());
    }

    public Optional<Alert> getAlertById(Long id) {
        return Optional.ofNullable(dataRepository.getAlerts().get(id));
    }

    public List<Alert> getActiveAlerts() {
        List<Alert> result = new ArrayList<>();
        for (Alert alert : dataRepository.getAlerts().values()) {
            if ("ACTIVE".equals(alert.getStatus())) {
                result.add(alert);
            }
        }
        return result;
    }

    public List<Alert> getAlertsByElder(Long elderId) {
        List<Alert> result = new ArrayList<>();
        for (Alert alert : dataRepository.getAlerts().values()) {
            if (elderId.equals(alert.getElderId())) {
                result.add(alert);
            }
        }
        return result;
    }

    public Alert createAlert(String alertType, String alertLevel, Long elderId, String elderName,
                             Long taskId, String taskName, String title, String description) {
        Alert alert = new Alert();
        alert.setId(dataRepository.generateAlertId());
        alert.setAlertType(alertType);
        alert.setAlertLevel(alertLevel);
        alert.setElderId(elderId);
        alert.setElderName(elderName);
        alert.setTaskId(taskId);
        alert.setTaskName(taskName);
        alert.setTitle(title);
        alert.setDescription(description);
        alert.setStatus("ACTIVE");
        alert.setCreateTime(LocalDateTime.now());

        dataRepository.getAlerts().put(alert.getId(), alert);
        return alert;
    }

    public Alert createTaskDelayAlert(CareTask task) {
        Elder elder = dataRepository.getElders().get(task.getElderId());
        String elderName = elder != null ? elder.getName() : "";

        return createAlert(
            "TASK_DELAY",
            "WARNING",
            task.getElderId(),
            elderName,
            task.getId(),
            task.getTaskName(),
            "护理任务延迟",
            "老人 [" + elderName + "] 的护理任务 [" + task.getTaskName() + "] 已超过预定时间，请尽快处理"
        );
    }

    public Alert createFinancialAlert(Long elderId, String elderName, int overdueDays) {
        return createAlert(
            "FINANCIAL_OVERDUE",
            "INFO",
            elderId,
            elderName,
            null,
            null,
            "费用逾期提醒",
            "老人 [" + elderName + "] 的费用已逾期 [" + overdueDays + "] 天，请提醒家属缴费"
        );
    }

    public Optional<Alert> handleAlert(Long alertId, String handledBy, String handleNote) {
        Alert alert = dataRepository.getAlerts().get(alertId);
        if (alert == null) {
            return Optional.empty();
        }
        alert.setStatus("HANDLED");
        alert.setHandleTime(LocalDateTime.now());
        alert.setHandledBy(handledBy);
        alert.setHandleNote(handleNote);
        return Optional.of(alert);
    }

    public void checkAndGenerateTaskDelayAlerts() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        for (CareTask task : dataRepository.getCareTasks().values()) {
            if (!"PENDING".equals(task.getStatus()) || task.getIsPaused() || !today.equals(task.getTaskDate())) {
                continue;
            }

            if (task.getScheduledTime() != null) {
                LocalDateTime scheduledDateTime = LocalDateTime.of(today, task.getScheduledTime());
                if (now.isAfter(scheduledDateTime.plusHours(1))) {
                    boolean existingAlert = false;
                    for (Alert alert : dataRepository.getAlerts().values()) {
                        if ("ACTIVE".equals(alert.getStatus()) && 
                            task.getId().equals(alert.getTaskId()) &&
                            "TASK_DELAY".equals(alert.getAlertType())) {
                            existingAlert = true;
                            break;
                        }
                    }
                    if (!existingAlert) {
                        createTaskDelayAlert(task);
                    }
                }
            }
        }
    }
}
