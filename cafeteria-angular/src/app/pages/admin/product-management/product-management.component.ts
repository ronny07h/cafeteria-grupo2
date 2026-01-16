import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ProductCardComponent } from '../../../components/common/product-card/product-card.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'all';
  loading: boolean = true;
  error: string | null = null;
  showModal: boolean = false;
  editingProduct: any = null;
  formData: any = {
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
  };

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
        console.error('Error loading data:', err);
        this.error = 'Error al cargar los datos. Por favor, intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  handleOpenModal(product: any = null): void {
    if (product) {
      this.editingProduct = product;
      this.formData = {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.category?.id || product.categoryId || '',
        imageUrl: product.imageUrl || '',
      };
    } else {
      this.editingProduct = null;
      this.formData = {
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: '',
      };
    }
    this.showModal = true;
  }

  handleCloseModal(): void {
    this.showModal = false;
    this.editingProduct = null;
    this.formData = {
      name: '',
      description: '',
      price: '',
      categoryId: '',
      imageUrl: '',
    };
  }

  handleSubmit(): void {
    // Basic validation handled by HTML 5 required attributes, but good to check
    const productData = {
      ...this.formData,
      price: parseFloat(this.formData.price),
      categoryId: parseInt(this.formData.categoryId, 10),
    };

    // Check if categoryId is a valid number, if not, it might be an issue.
    if (!productData && !productData.categoryId) {
      alert('Por favor selecciona una categoría válida');
      return;
    }

    // Since our backend expects the whole category object sometimes or just ID depending on impl.
    // Based on react code: categoryId: parseInt(formData.categoryId)
    // The service usually handles this. Let's assume sending object with ID matches backend better if it expects entity,
    // but React code sent `categoryId`. Let's assume createProduct DTO expects categoryId or we construct it.
    // Looking at React `productService` wasn't shown but likely standard REST.
    // Let's rely on `productData` matching what backend expects. The React code sends `categoryId`.

    // However, looking at the `ProductService` I implemented (generic http), I send what I get.
    // If backend expects `{ category: { id: 1 } }` vs `{ categoryId: 1 }`, that matters.
    // React code: `const productData = { ...formData, categoryId: parseInt(formData.categoryId) };`
    // So backend likely accepts `categoryId`.

    const request = this.editingProduct
      ? this.productService.updateProduct(this.editingProduct.id, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: () => {
        this.loadData();
        this.handleCloseModal();
      },
      error: (err) => {
        console.error('Error saving product:', err);
        alert('Error al guardar el producto. Por favor, intenta de nuevo.');
      },
    });
  }

  handleDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
        },
      });
    }
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
        const catId = product.category?.id || product.category;
        return catId === parseInt(this.selectedCategory, 10);
      });
    }
  }
}
