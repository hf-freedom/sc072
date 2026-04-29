package com.nursinghome.controller;

import com.nursinghome.entity.Bill;
import com.nursinghome.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        Optional<Bill> bill = billService.getBillById(id);
        return bill.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/elder/{elderId}")
    public List<Bill> getBillsByElder(@PathVariable Long elderId) {
        return billService.getBillsByElder(elderId);
    }

    @GetMapping("/unpaid")
    public List<Bill> getUnpaidBills() {
        return billService.getUnpaidBills();
    }

    @PostMapping("/generate")
    public Bill generateMonthlyBill(
            @RequestParam Long elderId,
            @RequestParam Integer year,
            @RequestParam Integer month) {
        return billService.generateMonthlyBill(elderId, year, month);
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Bill> payBill(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @RequestParam String paymentMethod) {
        Optional<Bill> bill = billService.payBill(id, amount, paymentMethod);
        return bill.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
