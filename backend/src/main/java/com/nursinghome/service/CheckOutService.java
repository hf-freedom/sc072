package com.nursinghome.service;

import com.nursinghome.entity.*;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CheckOutService {

    @Autowired
    private DataRepository dataRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private BillService billService;

    public CheckOutResult checkOut(Long elderId, String reason) {
        CheckOutResult result = new CheckOutResult();

        Elder elder = dataRepository.getElders().get(elderId);
        if (elder == null || !"ACTIVE".equals(elder.getStatus())) {
            result.setSuccess(false);
            result.setMessage("老人不存在或已退住");
            return result;
        }

        result.setElder(elder);

        List<Bill> unpaidBills = new ArrayList<>();
        for (Bill bill : dataRepository.getBills().values()) {
            if (elderId.equals(bill.getElderId()) && 
                ("UNPAID".equals(bill.getStatus()) || "PARTIAL_PAID".equals(bill.getStatus()))) {
                unpaidBills.add(bill);
            }
        }

        if (!unpaidBills.isEmpty()) {
            result.setHasUnpaidBills(true);
            result.setUnpaidBills(unpaidBills);
            
            BigDecimal totalUnpaid = BigDecimal.ZERO;
            for (Bill bill : unpaidBills) {
                totalUnpaid = totalUnpaid.add(bill.getUnpaidAmount());
            }
            result.setTotalUnpaidAmount(totalUnpaid);
            
            result.setSuccess(false);
            result.setMessage("存在未结清的费用，需先结清费用");
            return result;
        }

        for (Bed bed : dataRepository.getBeds().values()) {
            if (elderId.equals(bed.getElderId())) {
                roomService.releaseBed(bed.getId());
                result.setReleasedBed(bed);
                break;
            }
        }

        for (CarePlan plan : dataRepository.getCarePlans().values()) {
            if (elderId.equals(plan.getElderId()) && "ACTIVE".equals(plan.getStatus())) {
                plan.setStatus("ARCHIVED");
                result.setArchivedCarePlan(plan);
            }
        }

        for (CareTask task : dataRepository.getCareTasks().values()) {
            if (elderId.equals(task.getElderId()) && 
                ("PENDING".equals(task.getStatus()) || "PAUSED".equals(task.getStatus()))) {
                task.setStatus("CANCELLED");
            }
        }

        for (MedicationPlan plan : dataRepository.getMedicationPlans().values()) {
            if (elderId.equals(plan.getElderId()) && "ACTIVE".equals(plan.getStatus())) {
                plan.setStatus("ARCHIVED");
            }
        }

        elder.setStatus("CHECKED_OUT");
        elder.setCheckOutDate(LocalDate.now());
        elder.setBedId(null);

        result.setSuccess(true);
        result.setMessage("退住成功，费用已结清，床位已释放，护理记录已归档");

        return result;
    }

    public static class CheckOutResult {
        private boolean success;
        private String message;
        private Elder elder;
        private boolean hasUnpaidBills;
        private List<Bill> unpaidBills;
        private BigDecimal totalUnpaidAmount;
        private Bed releasedBed;
        private CarePlan archivedCarePlan;

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

        public boolean isHasUnpaidBills() {
            return hasUnpaidBills;
        }

        public void setHasUnpaidBills(boolean hasUnpaidBills) {
            this.hasUnpaidBills = hasUnpaidBills;
        }

        public List<Bill> getUnpaidBills() {
            return unpaidBills;
        }

        public void setUnpaidBills(List<Bill> unpaidBills) {
            this.unpaidBills = unpaidBills;
        }

        public BigDecimal getTotalUnpaidAmount() {
            return totalUnpaidAmount;
        }

        public void setTotalUnpaidAmount(BigDecimal totalUnpaidAmount) {
            this.totalUnpaidAmount = totalUnpaidAmount;
        }

        public Bed getReleasedBed() {
            return releasedBed;
        }

        public void setReleasedBed(Bed releasedBed) {
            this.releasedBed = releasedBed;
        }

        public CarePlan getArchivedCarePlan() {
            return archivedCarePlan;
        }

        public void setArchivedCarePlan(CarePlan archivedCarePlan) {
            this.archivedCarePlan = archivedCarePlan;
        }
    }
}
