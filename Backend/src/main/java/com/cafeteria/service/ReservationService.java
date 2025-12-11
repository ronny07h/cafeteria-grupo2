package com.cafeteria.service;

import com.cafeteria.model.Reservation;
import com.cafeteria.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
    
    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }
    
    public List<Reservation> getReservationsByDate(LocalDate date) {
        return reservationRepository.findByDate(date);
    }
    
    public List<Reservation> getReservationsByEmail(String email) {
        return reservationRepository.findByEmail(email);
    }
    
    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }
    
    public Reservation updateReservation(Long id, Reservation reservationDetails) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        
        reservation.setName(reservationDetails.getName());
        reservation.setEmail(reservationDetails.getEmail());
        reservation.setPhone(reservationDetails.getPhone());
        reservation.setDate(reservationDetails.getDate());
        reservation.setTime(reservationDetails.getTime());
        reservation.setPersons(reservationDetails.getPersons());
        reservation.setMessage(reservationDetails.getMessage());
        
        return reservationRepository.save(reservation);
    }
    
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}
