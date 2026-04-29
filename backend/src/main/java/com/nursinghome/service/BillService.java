package com.nursinghome.service;

import com.nursinghome.entity.*;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private DataRepository dataRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private CarePlanService carePlanService;

    @Autowired
    private MedicationService medicationService;

    public List<Bill> getAllBills() {
        return new ArrayList<>(dataRepository.getBills().values());
    }

    public Optional<Bill> getBillById(Long id) {
        return Optional.ofNullable(dataRepository.getBills().get(id));
    }

    public List<Bill> getBillsByElder(Long elderId) {
        List<Bill> result = new ArrayList<>();
        for (Bill bill : dataRepository.getBills().values()) {
            if (elderId.equals(bill.getElderId())) {
                result.add(bill);
            }
        }
        return result;
    }

    public List<Bill> getUnpaidBills() {
        List<Bill> result = new ArrayList<>();
        for (Bill bill : dataRepository.getBills().values()) {
            if ("UNPAID".equals(bill.getStatus()) || "PARTIAL_PAID".equals(bill.getStatus())) {
                result.add(bill);
            }
        }
        return result;
    }

    public Bill generateMonthlyBill(Long elderId, int year, int month) {
        Elder elder = dataRepository.getElders().get(elderId);
        if (elder == null) {
            return null;
        }

        Bill bill = new Bill();
        bill.setId(dataRepository.generateBillId());
        bill.setBillNo(generateBillNo(year, month, bill.getId()));
        bill.setElderId(elderId);
        bill.setElderName(elder.getName());
        bill.setBillYear(year);
        bill.setBillMonth(month);
        bill.setBillDate(LocalDate.now());
        bill.setDueDate(LocalDate.of(year, month, 1).plusMonths(1).withDayOfMonth(10));
        bill.setStatus("UNPAID");
        bill.setCreateTime(LocalDateTime.now());
        bill.setHasReminder(false);

        List<BillItem> items = new ArrayList<>();

        BigDecimal bedFee = calculateBedFee(elder);
        bill.setBedFee(bedFee);
        if (bedFee.compareTo(BigDecimal.ZERO) > 0) {
            items.add(createBillItem(bill.getId(), "BED", "床位费", "当月床位使用费", 1, bedFee, bedFee));
        }

        BigDecimal careFee = calculateCareFee(elder);
        bill.setCareFee(careFee);
        if (careFee.compareTo(BigDecimal.ZERO) > 0) {
            items.add(createBillItem(bill.getId(), "CARE", "护理费", "当月护理服务费", 1, careFee, careFee));
        }

        BigDecimal medicationFee = calculateMedicationFee(elder, year, month);
        bill.setMedicationFee(medicationFee);
        if (medicationFee.compareTo(BigDecimal.ZERO) > 0) {
            items.add(createBillItem(bill.getId(), "MEDICATION", "药品费", "当月药品费用", 1, medicationFee, medicationFee));
        }

        bill.setExtraServiceFee(BigDecimal.ZERO);
        bill.setTotalAmount(bedFee.add(careFee).add(medicationFee));
        bill.setPaidAmount(BigDecimal.ZERO);
        bill.setUnpaidAmount(bill.getTotalAmount());
        bill.setOverdueDays(0);

        bill.setItems(items);

        dataRepository.getBills().put(bill.getId(), bill);
        return bill;
    }

    private String generateBillNo(int year, int month, Long billId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMM");
        YearMonth ym = YearMonth.of(year, month);
        return "BL" + ym.format(formatter) + String.format("%05d", billId);
    }

    private BillItem createBillItem(Long billId, String itemType, String itemName, String description,
                                     Integer quantity, BigDecimal unitPrice, BigDecimal amount) {
        BillItem item = new BillItem();
        item.setBillId(billId);
        item.setItemType(itemType);
        item.setItemName(itemName);
        item.setItemDescription(description);
        item.setQuantity(quantity);
        item.setUnitPrice(unitPrice);
        item.setAmount(amount);
        return item;
    }

    private BigDecimal calculateBedFee(Elder elder) {
        for (Bed bed : dataRepository.getBeds().values()) {
            if (elder.getId().equals(bed.getElderId())) {
                return bed.getPrice();
            }
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal calculateCareFee(Elder elder) {
        for (CareLevel level : dataRepository.getCareLevels().values()) {
            if (level.getLevelCode().equals(elder.getCareLevel())) {
                return level.getMonthlyFee();
            }
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal calculateMedicationFee(Elder elder, int year, int month) {
        BigDecimal total = BigDecimal.ZERO;
        for (MedicationPlan plan : dataRepository.getMedicationPlans().values()) {
            if (elder.getId().equals(plan.getElderId()) && "ACTIVE".equals(plan.getStatus())) {
                if (plan.getItems() != null) {
                    for (MedicationItem item : plan.getItems()) {
                        if (item.getPrice() != null) {
                            total = total.add(item.getPrice());
                        }
                    }
                }
            }
        }
        return total;
    }

    public Optional<Bill> payBill(Long billId, BigDecimal amount, String paymentMethod) {
        Bill bill = dataRepository.getBills().get(billId);
        if (bill == null) {
            return Optional.empty();
        }

        BigDecimal newPaidAmount = bill.getPaidAmount().add(amount);
        bill.setPaidAmount(newPaidAmount);
        bill.setUnpaidAmount(bill.getTotalAmount().subtract(newPaidAmount));
        bill.setPaymentMethod(paymentMethod);
        bill.setPaidTime(LocalDateTime.now());

        if (bill.getUnpaidAmount().compareTo(BigDecimal.ZERO) <= 0) {
            bill.setStatus("PAID");
            bill.setUnpaidAmount(BigDecimal.ZERO);
        } else {
            bill.setStatus("PARTIAL_PAID");
        }

        return Optional.of(bill);
    }

    public void updateOverdueStatus() {
        LocalDate today = LocalDate.now();
        for (Bill bill : dataRepository.getBills().values()) {
            if (("UNPAID".equals(bill.getStatus()) || "PARTIAL_PAID".equals(bill.getStatus())) 
                    && bill.getDueDate() != null) {
                if (today.isAfter(bill.getDueDate())) {
                    int days = (int) java.time.temporal.ChronoUnit.DAYS.between(bill.getDueDate(), today);
                    bill.setOverdueDays(days);
                }
            }
        }
    }
}
