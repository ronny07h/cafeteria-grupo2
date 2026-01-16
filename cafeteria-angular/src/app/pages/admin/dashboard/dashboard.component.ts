import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ReservationService } from '../../../services/reservation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats = {
    totalProducts: 0,
    totalCategories: 0,
    totalReservations: 0,
  };
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    forkJoin({
      products: this.productService.getAllProducts(),
      categories: this.categoryService.getAllCategories(),
      reservations: this.reservationService.getAllReservations(),
    }).subscribe({
      next: (data) => {
        this.stats = {
          totalProducts: data.products.length,
          totalCategories: data.categories.length,
          totalReservations: data.reservations.length,
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats', err);
        this.loading = false;
      },
    });
  }
}
