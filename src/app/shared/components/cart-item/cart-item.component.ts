import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../interfaces/cart-item.interface';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item">
      <img [src]="item.imageUrl" [alt]="item.title" class="item-image">
      
      <div class="item-details">
        <h4 class="item-title">{{ item.title }}</h4>
        <p class="item-price">\${{ item.price }}</p>
        
        <div class="item-options" *ngIf="hasOptions()">
          <p *ngIf="item.sugarLevel" class="option">Sugar: {{ item.sugarLevel }}</p>
          <p *ngIf="item.iceLevel" class="option">Ice: {{ item.iceLevel }}</p>
          <p *ngIf="item.spiceLevel" class="option">Spice: {{ item.spiceLevel }}</p>
          <p *ngIf="item.soupType" class="option">Soup: {{ getSoupTypeName(item.soupType) }}</p>
          <p *ngIf="item.iced" class="option">Iced: {{ item.iced }}</p>
          <p *ngIf="item.topping && item.topping !== 'None'" class="option">Topping: {{ item.topping }}</p>
          <p *ngIf="item.specialInstructions" class="option special">{{ item.specialInstructions }}</p>
        </div>
      </div>
      
      <div class="quantity-controls">
        <button (click)="decreaseQuantity()" class="quantity-btn" [disabled]="item.quantity <= 1">-</button>
        <span class="quantity">{{ item.quantity }}</span>
        <button (click)="increaseQuantity()" class="quantity-btn">+</button>
      </div>
      
      <button (click)="removeItem()" class="remove-btn">Remove</button>
    </div>
  `,
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Input() index!: number;
  @Output() quantityChanged = new EventEmitter<{index: number, quantity: number}>();
  @Output() itemRemoved = new EventEmitter<number>();

  private soupTypeNames: {[key: string]: string} = {
    'sichuan_spicy': 'Sichuan Spicy',
    'chongqing_spicy': 'Chongqing Spicy',
    'milky_broth': 'Milky Broth',
    'tomato': 'Tomato',
    'wild_mushroom': 'Wild Mushroom'
  };

  hasOptions(): boolean {
    return !!(this.item.sugarLevel || this.item.iceLevel || this.item.spiceLevel || 
             this.item.soupType || this.item.iced || 
             (this.item.topping && this.item.topping !== 'None') ||
             this.item.specialInstructions);
  }

  getSoupTypeName(soupType: string | undefined): string {
    return soupType ? this.soupTypeNames[soupType] || soupType : '';
  }

  increaseQuantity(): void {
    this.quantityChanged.emit({index: this.index, quantity: this.item.quantity + 1});
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChanged.emit({index: this.index, quantity: this.item.quantity - 1});
    }
  }

  removeItem(): void {
    this.itemRemoved.emit(this.index);
  }
} 