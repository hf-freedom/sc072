package com.nursinghome.scheduler;

import com.nursinghome.entity.Bill;
import com.nursinghome.entity.Elder;
import com.nursinghome.repository.DataRepository;
import com.nursinghome.service.AlertService;
import com.nursinghome.service.BillService;
import com.nursinghome.service.CarePlanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ScheduledTasks {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    @Autowired
    private DataRepository dataRepository;

    @Autowired
    private CarePlanService carePlanService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private BillService billService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void generateDailyCareTasks() {
        logger.info("开始生成每日护理任务...");
        LocalDate today = LocalDate.now();
        int taskCount = 0;

        for (Elder elder : dataRepository.getElders().values()) {
            if ("ACTIVE".equals(elder.getStatus()) && !elder.getIsTemporaryLeave()) {
                carePlanService.generateDailyTasks(elder, today);
                taskCount++;
            }
        }

        logger.info("每日护理任务生成完成，共处理 {} 位老人", taskCount);
    }

    @Scheduled(fixedRate = 60000)
    public void checkTaskDelay() {
        logger.debug("检查护理任务延迟情况...");
        alertService.checkAndGenerateTaskDelayAlerts();
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public void checkFinancialOverdue() {
        logger.info("检查费用逾期情况...");
        LocalDate today = LocalDate.now();

        for (Bill bill : dataRepository.getBills().values()) {
            if (("UNPAID".equals(bill.getStatus()) || "PARTIAL_PAID".equals(bill.getStatus())) 
                    && bill.getDueDate() != null) {
                if (today.isAfter(bill.getDueDate())) {
                    int days = (int) java.time.temporal.ChronoUnit.DAYS.between(bill.getDueDate(), today);
                    bill.setOverdueDays(days);

                    if (days >= 3 && !bill.getHasReminder()) {
                        boolean hasActiveAlert = false;
                        for (com.nursinghome.entity.Alert alert : dataRepository.getAlerts().values()) {
                            if ("ACTIVE".equals(alert.getStatus()) &&
                                bill.getElderId().equals(alert.getElderId()) &&
                                "FINANCIAL_OVERDUE".equals(alert.getAlertType())) {
                                hasActiveAlert = true;
                                break;
                            }
                        }

                        if (!hasActiveAlert) {
                            alertService.createFinancialAlert(
                                bill.getElderId(),
                                bill.getElderName(),
                                days
                            );
                            bill.setHasReminder(true);
                        }
                    }
                }
            }
        }

        logger.info("费用逾期检查完成");
    }

    @Scheduled(cron = "0 0 2 1 * ?")
    public void generateMonthlyBills() {
        logger.info("开始生成月度账单...");
        LocalDate today = LocalDate.now();
        int billCount = 0;

        for (Elder elder : dataRepository.getElders().values()) {
            if ("ACTIVE".equals(elder.getStatus())) {
                billService.generateMonthlyBill(
                    elder.getId(),
                    today.getYear(),
                    today.getMonthValue()
                );
                billCount++;
            }
        }

        logger.info("月度账单生成完成，共生成 {} 份账单", billCount);
    }
}
