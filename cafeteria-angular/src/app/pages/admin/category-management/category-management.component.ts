import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css',
})
export class CategoryManagementComponent implements OnInit {
  categories: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  showModal: boolean = false;
  editingCategory: any = null;
  formData: any = { name: '' };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error =
          'Error al cargar las categorías. Por favor, intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  handleOpenModal(category: any = null): void {
    if (category) {
      this.editingCategory = category;
      this.formData = { name: category.name };
    } else {
      this.editingCategory = null;
      this.formData = { name: '' };
    }
    this.showModal = true;
  }

  handleCloseModal(): void {
    this.showModal = false;
    this.editingCategory = null;
    this.formData = { name: '' };
  }

  onNameChange(value: string) {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
      this.formData.name = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
    }
  }

  handleSubmit(): void {
    const request = this.editingCategory
      ? this.categoryService.updateCategory(
          this.editingCategory.id,
          this.formData
        )
      : this.categoryService.createCategory(this.formData);

    request.subscribe({
      next: () => {
        this.loadCategories();
        this.handleCloseModal();
      },
      error: (err) => {
        console.error('Error saving category:', err);
        alert('Error al guardar la categoría. Por favor, intenta de nuevo.');
      },
    });
  }

  handleDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert('Error al eliminar la categoría. Por favor, intenta de nuevo.');
        },
      });
    }
  }
}
