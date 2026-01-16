import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    persons: '2',
  };
  submitting = false;
  message = { type: '', text: '' };

  constructor(private reservationService: ReservationService) {}

  onNameChange(value: string) {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
      // Ideally we'd prevent the update or reset it, but simple binding updates.
      // In Angular template-driven, simpler to validate on submit or use patterns.
      // Here we force reset if invalid char
      this.formData.name = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
    }
  }

  onPhoneChange(value: string) {
    if (!/^\d*$/.test(value)) {
      this.formData.phone = value.replace(/\D/g, '');
    }
  }

  handleSubmit() {
    this.submitting = true;
    this.message = { type: '', text: '' };

    this.reservationService.createReservation(this.formData).subscribe({
      next: () => {
        this.message = {
          type: 'success',
          text: '¡Reserva enviada exitosamente! Nos pondremos en contacto contigo pronto.',
        };
        this.formData = {
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          persons: '2',
        };
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error submitting reservation:', error);
        this.message = {
          type: 'danger',
          text: 'Error al enviar la reserva. Por favor, intenta de nuevo.',
        };
        this.submitting = false;
      },
    });
  }
}
