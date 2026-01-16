import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/common/product-card/product-card.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'all';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      products: this.productService.getAllProducts(),
      categories: this.categoryService.getAllCategories(),
    }).subscribe({
      next: (data) => {
        this.products = data.products;
        this.categories = data.categories;
        this.filterProducts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading menu:', err);
        this.error = 'Error al cargar el menú. Por favor, intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  handleCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterProducts();
  }

  filterProducts(): void {
    if (this.selectedCategory === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter((product) => {
        const categoryId = product.category?.id || product.category;
        return categoryId === parseInt(this.selectedCategory, 10);
      });
    }
  }
}
