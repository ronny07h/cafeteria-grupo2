import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CompanyService } from '../../services/company.service';
import { ProductCardComponent } from '../../components/common/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  companyName: string = 'Café Aroma';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.companyService.getCompanyConfig().subscribe((config) => {
      if (config && config.name) {
        this.companyName = config.name;
      }
    });

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.slice(0, 6);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.error = 'Error al cargar los datos. Por favor, intenta de nuevo.';
        this.loading = false;
      },
    });
  }
}
