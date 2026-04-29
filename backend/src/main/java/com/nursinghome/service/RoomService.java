package com.nursinghome.service;

import com.nursinghome.entity.Bed;
import com.nursinghome.entity.Room;
import com.nursinghome.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private DataRepository dataRepository;

    public List<Room> getAllRooms() {
        List<Room> rooms = new ArrayList<>();
        for (Room room : dataRepository.getRooms().values()) {
            Room roomWithUpdatedBeds = getRoomWithUpdatedBeds(room);
            rooms.add(roomWithUpdatedBeds);
        }
        return rooms;
    }

    public Optional<Room> getRoomById(Long id) {
        Room room = dataRepository.getRooms().get(id);
        if (room == null) {
            return Optional.empty();
        }
        return Optional.of(getRoomWithUpdatedBeds(room));
    }

    private Room getRoomWithUpdatedBeds(Room room) {
        Room roomCopy = new Room();
        roomCopy.setId(room.getId());
        roomCopy.setRoomNumber(room.getRoomNumber());
        roomCopy.setCareArea(room.getCareArea());
        roomCopy.setRoomType(room.getRoomType());
        roomCopy.setBedCount(room.getBedCount());
        roomCopy.setOccupiedBedCount(room.getOccupiedBedCount());
        roomCopy.setBasePrice(room.getBasePrice());
        roomCopy.setStatus(room.getStatus());
        roomCopy.setDescription(room.getDescription());

        List<Bed> updatedBeds = new ArrayList<>();
        for (Bed bed : dataRepository.getBeds().values()) {
            if (room.getId().equals(bed.getRoomId())) {
                Bed bedCopy = new Bed();
                bedCopy.setId(bed.getId());
                bedCopy.setBedNumber(bed.getBedNumber());
                bedCopy.setRoomId(bed.getRoomId());
                bedCopy.setRoomNumber(bed.getRoomNumber());
                bedCopy.setCareArea(bed.getCareArea());
                bedCopy.setPrice(bed.getPrice());
                bedCopy.setStatus(bed.getStatus());
                bedCopy.setElderId(bed.getElderId());
                bedCopy.setElderName(bed.getElderName());
                updatedBeds.add(bedCopy);
            }
        }
        roomCopy.setBeds(updatedBeds);

        return roomCopy;
    }

    public List<Room> getRoomsByCareArea(String careArea) {
        List<Room> result = new ArrayList<>();
        for (Room room : dataRepository.getRooms().values()) {
            if (careArea.equals(room.getCareArea())) {
                result.add(getRoomWithUpdatedBeds(room));
            }
        }
        return result;
    }

    public List<Bed> getAllBeds() {
        return new ArrayList<>(dataRepository.getBeds().values());
    }

    public Optional<Bed> getBedById(Long id) {
        return Optional.ofNullable(dataRepository.getBeds().get(id));
    }

    public List<Bed> getAvailableBeds() {
        List<Bed> available = new ArrayList<>();
        for (Bed bed : dataRepository.getBeds().values()) {
            if ("AVAILABLE".equals(bed.getStatus())) {
                available.add(bed);
            }
        }
        return available;
    }

    public List<Bed> getBedsByRoom(Long roomId) {
        List<Bed> result = new ArrayList<>();
        for (Bed bed : dataRepository.getBeds().values()) {
            if (roomId.equals(bed.getRoomId())) {
                result.add(bed);
            }
        }
        return result;
    }

    public Room createRoom(Room room) {
        room.setId(dataRepository.generateRoomId());
        room.setOccupiedBedCount(0);
        room.setStatus("AVAILABLE");
        if (room.getBeds() != null) {
            for (Bed bed : room.getBeds()) {
                bed.setId(dataRepository.generateBedId());
                bed.setRoomId(room.getId());
                bed.setRoomNumber(room.getRoomNumber());
                bed.setCareArea(room.getCareArea());
                if (bed.getPrice() == null) {
                    bed.setPrice(room.getBasePrice());
                }
                bed.setStatus("AVAILABLE");
                dataRepository.getBeds().put(bed.getId(), bed);
            }
        }
        dataRepository.getRooms().put(room.getId(), room);
        return room;
    }

    public Bed createBed(Long roomId, Bed bed) {
        Room room = dataRepository.getRooms().get(roomId);
        if (room == null) {
            return null;
        }
        bed.setId(dataRepository.generateBedId());
        bed.setRoomId(roomId);
        bed.setRoomNumber(room.getRoomNumber());
        bed.setCareArea(room.getCareArea());
        if (bed.getPrice() == null) {
            bed.setPrice(room.getBasePrice());
        }
        bed.setStatus("AVAILABLE");
        dataRepository.getBeds().put(bed.getId(), bed);
        room.setBedCount(room.getBedCount() + 1);
        if (room.getBeds() != null) {
            room.getBeds().add(bed);
        }
        return bed;
    }

    public boolean assignBed(Long bedId, Long elderId, String elderName) {
        Bed bed = dataRepository.getBeds().get(bedId);
        if (bed == null || !"AVAILABLE".equals(bed.getStatus())) {
            return false;
        }
        bed.setStatus("OCCUPIED");
        bed.setElderId(elderId);
        bed.setElderName(elderName);
        dataRepository.getBeds().put(bed.getId(), bed);

        Room room = dataRepository.getRooms().get(bed.getRoomId());
        if (room != null) {
            room.setOccupiedBedCount(room.getOccupiedBedCount() + 1);
            if (room.getOccupiedBedCount() >= room.getBedCount()) {
                room.setStatus("FULL");
            }
            dataRepository.getRooms().put(room.getId(), room);
        }
        return true;
    }

    public boolean releaseBed(Long bedId) {
        Bed bed = dataRepository.getBeds().get(bedId);
        if (bed == null || !"OCCUPIED".equals(bed.getStatus())) {
            return false;
        }
        bed.setStatus("AVAILABLE");
        bed.setElderId(null);
        bed.setElderName(null);
        dataRepository.getBeds().put(bed.getId(), bed);

        Room room = dataRepository.getRooms().get(bed.getRoomId());
        if (room != null) {
            room.setOccupiedBedCount(room.getOccupiedBedCount() - 1);
            if (room.getOccupiedBedCount() < room.getBedCount()) {
                room.setStatus("AVAILABLE");
            }
            dataRepository.getRooms().put(room.getId(), room);
        }
        return true;
    }
}
