package com.nursinghome.controller;

import com.nursinghome.entity.Bed;
import com.nursinghome.entity.Room;
import com.nursinghome.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/care-area/{careArea}")
    public List<Room> getRoomsByCareArea(@PathVariable String careArea) {
        return roomService.getRoomsByCareArea(careArea);
    }

    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomService.createRoom(room);
    }

    @GetMapping("/beds")
    public List<Bed> getAllBeds() {
        return roomService.getAllBeds();
    }

    @GetMapping("/beds/{id}")
    public ResponseEntity<Bed> getBedById(@PathVariable Long id) {
        Optional<Bed> bed = roomService.getBedById(id);
        return bed.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/beds/available")
    public List<Bed> getAvailableBeds() {
        return roomService.getAvailableBeds();
    }

    @GetMapping("/{roomId}/beds")
    public List<Bed> getBedsByRoom(@PathVariable Long roomId) {
        return roomService.getBedsByRoom(roomId);
    }

    @PostMapping("/{roomId}/beds")
    public ResponseEntity<Bed> createBed(@PathVariable Long roomId, @RequestBody Bed bed) {
        Bed created = roomService.createBed(roomId, bed);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.notFound().build();
    }

    @PutMapping("/beds/{bedId}/assign")
    public ResponseEntity<Void> assignBed(
            @PathVariable Long bedId,
            @RequestParam Long elderId,
            @RequestParam String elderName) {
        boolean success = roomService.assignBed(bedId, elderId, elderName);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PutMapping("/beds/{bedId}/release")
    public ResponseEntity<Void> releaseBed(@PathVariable Long bedId) {
        boolean success = roomService.releaseBed(bedId);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
