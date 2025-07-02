import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CartDialogService } from '../shared/services/cart-dialog.service';
import { MenuItem, MenuItemType } from '../shared/interfaces/menu-item.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() imageSrc: string = '';
  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() itemType: MenuItemType = 'main';
  @Input() disabled: boolean = false;

  constructor(private cartDialogService: CartDialogService) {}

  addToCart() {
    // Don't add to cart if disabled or if it's a placeholder (price = 0)
    if (this.disabled || this.price === 0) {
      return;
    }

    const menuItem: MenuItem = {
      id: this.generateId(),
      imageSrc: this.imageSrc,
      title: this.title,
      price: this.price,
      type: this.itemType,
      category: this.getCategoryFromType()
    };

    this.cartDialogService.openAddToCartDialog(menuItem);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getCategoryFromType(): 'main-dishes' | 'side-dishes' | 'drinks' {
    if (this.itemType === 'drink' || this.itemType === 'bottled') {
      return 'drinks';
    }
    if (this.itemType === 'side') {
      return 'side-dishes';
    }
    return 'main-dishes';
  }
}
