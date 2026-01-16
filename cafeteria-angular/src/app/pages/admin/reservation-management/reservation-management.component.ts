import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReservationService } from '../../../services/reservation.service';
import localeEsEc from '@angular/common/locales/es-EC';

registerLocaleData(localeEsEc);

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-management.component.html',
  styleUrl: './reservation-management.component.css',
})
export class ReservationManagementComponent implements OnInit {
  reservations: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = null;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.error =
          'Error al cargar las reservas. Por favor, intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  handleDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.loadReservations();
        },
        error: (err) => {
          console.error('Error deleting reservation:', err);
          alert('Error al eliminar la reserva. Por favor, intenta de nuevo.');
        },
      });
    }
  }
}
