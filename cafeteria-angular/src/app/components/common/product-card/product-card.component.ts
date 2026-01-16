import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product: any;
  @Input() showActions: boolean = false;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  getCategoryName(category: any): string {
    if (typeof category === 'string') {
      return category;
    }
    return category?.name || '';
  }

  onEditClick() {
    this.edit.emit(this.product);
  }

  onDeleteClick() {
    this.delete.emit(this.product.id);
  }
}
