import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-config.component.html',
  styleUrl: './company-config.component.css',
})
export class CompanyConfigComponent implements OnInit {
  config: any = { name: '' };
  loading: boolean = true;
  error: string | null = null;
  saving: boolean = false;
  successMessage: string = '';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.loading = true;
    this.error = null;
    this.companyService.getCompanyConfig().subscribe({
      next: (data) => {
        this.config = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading config:', err);
        this.error =
          'Error al cargar la configuración. Por favor, intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  handleSubmit(): void {
    this.saving = true;
    this.error = null;
    this.successMessage = '';

    this.companyService.updateCompanyConfig(this.config).subscribe({
      next: () => {
        this.successMessage = 'Configuración actualizada exitosamente.';
        this.saving = false;
      },
      error: (err) => {
        console.error('Error saving config:', err);
        this.error =
          'Error al guardar la configuración. Por favor, intenta de nuevo.';
        this.saving = false;
      },
    });
  }
}
